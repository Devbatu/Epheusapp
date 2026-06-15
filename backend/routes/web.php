<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — SPA host
|--------------------------------------------------------------------------
| The React build (Vite) is copied into public/ during deployment.
| Static assets (js/css/images) are served directly by the web server.
| Every non-API, non-file route falls back to the SPA entry point so
| client-side routing works on refresh / deep links.
*/

Route::get('/', fn () => spa_response());

Route::fallback(fn () => spa_response());

if (! function_exists('spa_response')) {
    function spa_response()
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
