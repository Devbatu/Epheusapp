<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerAuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'CustomerAuthController::register is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function login(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'CustomerAuthController::login is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'CustomerAuthController::profile is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function updateProfile(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'CustomerAuthController::updateProfile is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
