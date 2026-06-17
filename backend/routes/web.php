<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SpaController;

/*
|--------------------------------------------------------------------------
| Web Routes — SPA host
|--------------------------------------------------------------------------
| The React build (Vite) is copied into public/ during deployment.
| Static assets (js/css/images) are served directly by the web server.
| Every non-API, non-file route falls back to the SPA entry point so
| client-side routing works on refresh / deep links.
|
| Invokable controller (not closures) so `route:cache` works in production.
*/

Route::get('/', SpaController::class);

Route::fallback(SpaController::class);
