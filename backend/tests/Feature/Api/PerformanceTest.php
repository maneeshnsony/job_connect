<?php

namespace Tests\Feature\Api;

use App\Models\Outreach;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PerformanceTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create(['email_verified_at' => now()]);
        $this->token = $this->user->createToken('auth-token')->plainTextToken;
    }

    public function test_index_response_time_with_large_dataset(): void
    {
        Outreach::factory()->count(200)->create(['user_id' => $this->user->id]);

        $start = microtime(true);
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/outreaches?per_page=50');
        $duration = (microtime(true) - $start) * 1000;

        $response->assertStatus(200);
        $this->assertLessThan(2000, $duration, 'Index response took too long: '.round($duration, 2).'ms');
    }

    public function test_cache_hits_on_subsequent_requests(): void
    {
        Outreach::factory()->count(10)->create(['user_id' => $this->user->id]);

        $response1 = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/outreaches');
        $response1->assertStatus(200);

        $response2 = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/outreaches');
        $response2->assertStatus(200);

        $this->assertEquals($response1->json('meta.total'), $response2->json('meta.total'));
    }

    public function test_cache_busts_on_create(): void
    {
        Outreach::factory()->count(5)->create(['user_id' => $this->user->id]);

        $before = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/outreaches');
        $beforeTotal = $before->json('meta.total');

        $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/outreaches', [
                'company' => 'New Corp',
                'sector' => 'Tech',
                'recruiter' => 'Jane Doe',
            ])->assertStatus(201);

        $after = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/outreaches');

        $this->assertEquals($beforeTotal + 1, $after->json('meta.total'));
    }

    public function test_batch_insert_performance(): void
    {
        $start = microtime(true);

        $outreaches = [];
        for ($i = 0; $i < 50; $i++) {
            $outreaches[] = [
                'user_id' => $this->user->id,
                'company' => "Company {$i}",
                'sector' => 'Tech',
                'recruiter' => "Recruiter {$i}",
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        Outreach::insert($outreaches);

        $duration = (microtime(true) - $start) * 1000;
        $this->assertLessThan(2000, $duration, 'Batch insert took too long: '.round($duration, 2).'ms');

        $this->assertEquals(50, Outreach::where('user_id', $this->user->id)->count());
    }

    public function test_health_endpoint_response_time(): void
    {
        $start = microtime(true);
        $response = $this->getJson('/api/health');
        $duration = (microtime(true) - $start) * 1000;

        $response->assertStatus(200);
        $this->assertLessThan(500, $duration, 'Health endpoint too slow: '.round($duration, 2).'ms');
    }
}
