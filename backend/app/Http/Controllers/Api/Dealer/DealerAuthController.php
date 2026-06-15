<?php

namespace App\Http\Controllers\Api\Dealer;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DealerAuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'DealerAuthController::register is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function login(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'DealerAuthController::login is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
