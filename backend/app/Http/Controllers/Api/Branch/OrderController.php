<?php

namespace App\Http\Controllers\Api\Branch;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'OrderController::index is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function store(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'OrderController::store is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'OrderController::show is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function update(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'OrderController::update is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function destroy(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'OrderController::destroy is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function updateStatus(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'OrderController::updateStatus is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
