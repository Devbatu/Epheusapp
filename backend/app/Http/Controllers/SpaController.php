<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

/**
 * Serves the React SPA entry point. Invokable (not a closure) so that
 * `php artisan route:cache` works in production.
 */
class SpaController extends Controller
{
    public function __invoke()
    {
        $entry = public_path('app.html');

        if (! file_exists($entry)) {
            return response(
                '<h1>Ephesus API</h1><p>Frontend build not deployed yet. API is available under <code>/api/v1</code>.</p>',
                200,
            )->header('Content-Type', 'text/html');
        }

        return response()->file($entry);
    }
}
