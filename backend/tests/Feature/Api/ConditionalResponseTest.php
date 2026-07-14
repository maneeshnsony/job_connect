<?php

namespace Tests\Feature\Api;

use App\Models\Outreach;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConditionalResponseTest extends TestCase
{
    use RefreshDatabase;

    public function test_response_has_etag_header(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200);
        $response->assertHeader('ETag');
    }

    public function test_etag_changes_when_content_changes(): void
    {
        $response1 = $this->getJson('/api/health');
        $etag1 = $response1->headers->get('ETag');

        $response2 = $this->getJson('/api/health');
        $etag2 = $response2->headers->get('ETag');

        $this->assertEquals($etag1, $etag2);
    }

    public function test_conditional_request_returns_304(): void
    {
        $response = $this->getJson('/api/health');
        $etag = $response->headers->get('ETag');

        $cachedResponse = $this->withHeaders(['If-None-Match' => $etag])
            ->getJson('/api/health');

        $cachedResponse->assertStatus(304);
    }

    public function test_stale_etag_returns_200(): void
    {
        $cachedResponse = $this->withHeaders(['If-None-Match' => '"stale-etag"'])
            ->getJson('/api/health');

        $cachedResponse->assertStatus(200);
    }

    public function test_etag_header_present_on_outreach_endpoints(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $token = $user->createToken('auth-token')->plainTextToken;

        Outreach::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/outreaches');

        $response->assertStatus(200);
        $response->assertHeader('ETag');
    }

    public function test_response_has_vary_header(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertHeader('Vary');
    }
}
