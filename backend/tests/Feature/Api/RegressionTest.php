<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegressionTest extends TestCase
{
    use RefreshDatabase;

    public function test_security_headers_are_present(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertHeader('X-Request-ID');
        $this->assertTrue($response->headers->has('X-Response-Time'));
    }

    public function test_cors_preflight(): void
    {
        $response = $this->withHeaders([
            'Origin' => 'http://localhost:3000',
            'Access-Control-Request-Method' => 'GET',
        ])->options('/api/health');

        $response->assertHeader('Access-Control-Allow-Origin');
        $response->assertHeader('Access-Control-Allow-Methods');
    }

    public function test_cache_busting_on_data_modification(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $token = $user->createToken('auth-token')->plainTextToken;
        $authHeader = ['Authorization' => "Bearer {$token}"];

        $before = $this->withHeaders($authHeader)
            ->getJson('/api/outreaches?per_page=1');
        $beforeTotal = $before->json('meta.total');

        $this->withHeaders($authHeader)
            ->postJson('/api/outreaches', [
                'company' => 'CacheBust Inc',
                'sector' => 'Test',
                'recruiter' => 'Test User',
            ])->assertStatus(201);

        $after = $this->withHeaders($authHeader)
            ->getJson('/api/outreaches?per_page=1');
        $this->assertEquals($beforeTotal + 1, $after->json('meta.total'));
    }
}
