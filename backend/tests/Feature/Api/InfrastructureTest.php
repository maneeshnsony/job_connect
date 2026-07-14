<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InfrastructureTest extends TestCase
{
    use RefreshDatabase;

    public function test_health_check_returns_all_checks(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'checks' => ['app', 'database', 'cache', 'queue', 'redis'],
                'timestamp',
                'version',
            ]);
    }

    public function test_response_has_request_id(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertHeader('X-Request-ID');
    }

    public function test_response_has_cors_headers(): void
    {
        $response = $this->withHeaders([
            'Origin' => 'http://localhost:3000',
            'Access-Control-Request-Method' => 'GET',
        ])->options('/api/health');

        $response->assertHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
            ->assertHeader('Access-Control-Allow-Methods');
    }

    public function test_health_response_time_is_under_200ms(): void
    {
        $times = [];
        for ($i = 0; $i < 5; $i++) {
            $start = microtime(true);
            $this->getJson('/api/health');
            $times[] = (microtime(true) - $start) * 1000;
        }

        $avg = array_sum($times) / count($times);
        $this->assertLessThan(200, $avg, 'Average health check response time: '.round($avg, 2).'ms');
    }
}
