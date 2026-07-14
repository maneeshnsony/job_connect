<?php

namespace Tests\Feature\Api;

use Tests\TestCase;

class SecurityHeadersTest extends TestCase
{
    public function test_api_response_has_security_headers(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'DENY');
        $response->assertHeader('Referrer-Policy');
        $response->assertHeader('Permissions-Policy');
        $response->assertHeader('Content-Security-Policy');
    }

    public function test_csp_restricts_external_sources(): void
    {
        $response = $this->getJson('/api/health');
        $csp = $response->headers->get('Content-Security-Policy');

        $this->assertStringContainsString("default-src 'self'", $csp);
        $this->assertStringContainsString("script-src 'self'", $csp);
        $this->assertStringContainsString("style-src 'self' 'unsafe-inline'", $csp);
        $this->assertStringContainsString("frame-ancestors 'none'", $csp);
        $this->assertStringContainsString('connect-src', $csp);
    }

    public function test_permissions_policy_denies_sensitive_apis(): void
    {
        $response = $this->getJson('/api/health');
        $policy = $response->headers->get('Permissions-Policy');

        $this->assertStringContainsString('camera=()', $policy);
        $this->assertStringContainsString('microphone=()', $policy);
        $this->assertStringContainsString('geolocation=()', $policy);
    }
}
