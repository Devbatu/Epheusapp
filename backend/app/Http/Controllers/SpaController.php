<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

/**
 * Serves the React SPA entry point. Invokable (not a closure) so that
 * `php artisan route:cache` works in production.
 *
 * The HTML shell is returned with no-cache headers so browsers always fetch
 * the current document (which references the latest hashed asset bundles).
 * The hashed /assets/* files remain immutably cacheable.
 */
class SpaController extends Controller
{
    public function __invoke(): Response
    {
        $entry = public_path('app.html');

        if (! file_exists($entry)) {
            return response(
                '<h1>Ephesus API</h1><p>Frontend build not deployed yet. API is available under <code>/api/v1</code>.</p>',
                200,
            )->header('Content-Type', 'text/html');
        }

        return response(file_get_contents($entry), 200, [
            'Content-Type'  => 'text/html; charset=UTF-8',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma'        => 'no-cache',
        ]);
    }
}
