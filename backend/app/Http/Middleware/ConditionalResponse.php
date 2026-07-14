<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ConditionalResponse
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($response->getStatusCode() !== 200) {
            return $response;
        }

        $content = $response->getContent();
        if ($content === false || $content === null) {
            return $response;
        }

        $etag = '"'.md5($content).'"';
        $response->headers->set('ETag', $etag);
        $response->headers->set('Vary', 'Accept-Encoding, Authorization');

        if ($request->headers->has('If-None-Match')) {
            $ifNoneMatch = $request->header('If-None-Match');
            if ($ifNoneMatch === $etag) {
                return response()->noContent(304);
            }
        }

        return $response;
    }
}
