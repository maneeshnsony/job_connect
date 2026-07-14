<?php

namespace Tests\Feature\Jobs;

use App\Jobs\BustOutreachCache;
use App\Jobs\LogUserAction;
use App\Models\Outreach;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class JobsTest extends TestCase
{
    use RefreshDatabase;

    public function test_bust_outreach_cache_job_dispatched_on_store(): void
    {
        Bus::fake();
        $user = User::factory()->create(['email_verified_at' => now()]);

        $this->actingAs($user)->postJson('/api/outreaches', [
            'company' => 'Test Corp',
            'recruiter' => 'Jane',
            'sector' => 'Tech',
        ]);

        Bus::assertDispatched(BustOutreachCache::class);
    }

    public function test_bust_outreach_cache_job_increments_cache(): void
    {
        $userId = 1;
        Cache::put('outreaches:v:'.$userId, 5);

        (new BustOutreachCache($userId))->handle();

        $this->assertEquals(6, Cache::get('outreaches:v:'.$userId));
    }

    public function test_log_user_action_job_writes_to_log(): void
    {
        Log::shouldReceive('channel')
            ->once()
            ->with('json')
            ->andReturnSelf();

        Log::expects('info')
            ->once()
            ->with('User action', \Mockery::on(function ($context) {
                return $context['user_id'] === 1 && $context['action'] === 'test_action';
            }));

        (new LogUserAction(1, 'test_action'))->handle();
    }

    public function test_bust_outreach_cache_job_queued_on_update(): void
    {
        Bus::fake();
        $user = User::factory()->create(['email_verified_at' => now()]);
        $outreach = Outreach::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)->putJson("/api/outreaches/{$outreach->id}", [
            'company' => 'Updated Co',
        ]);

        Bus::assertDispatched(BustOutreachCache::class);
    }

    public function test_bust_outreach_cache_job_queued_on_delete(): void
    {
        Bus::fake();
        $user = User::factory()->create(['email_verified_at' => now()]);
        $outreach = Outreach::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)->deleteJson("/api/outreaches/{$outreach->id}");

        Bus::assertDispatched(BustOutreachCache::class);
    }
}
