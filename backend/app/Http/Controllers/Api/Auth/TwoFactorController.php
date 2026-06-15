<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TwoFactorController extends Controller
{
    public function enable(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'TwoFactorController::enable is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function confirm(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'TwoFactorController::confirm is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function disable(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'TwoFactorController::disable is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function verify(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'TwoFactorController::verify is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
