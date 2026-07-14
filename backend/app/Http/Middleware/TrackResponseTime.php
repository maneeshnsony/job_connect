<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class TrackResponseTime
{
    public function handle(Request $request, Closure $next): Response
    {
        $start = microtime(true);

        $response = $next($request);

        $duration = (microtime(true) - $start) * 1000;

        if ($duration > 100) {
            Log::channel('json')->info('slow_request', [
                'method' => $request->method(),
                'path' => $request->path(),
                'duration_ms' => round($duration, 2),
                'status' => $response->getStatusCode(),
                'request_id' => $request->attributes->get('request_id'),
            ]);
        }

        $response->headers->set('X-Response-Time', round($duration, 2).'ms');

        return $response;
    }
}
