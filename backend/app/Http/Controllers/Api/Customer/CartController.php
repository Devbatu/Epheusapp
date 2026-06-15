<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'CartController::index is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function store(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'CartController::store is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function update(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'CartController::update is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function destroy(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'CartController::destroy is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function checkout(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'CartController::checkout is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
