<?php

namespace App\Http\Controllers\Api\Branch;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'PurchaseController::index is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function store(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'PurchaseController::store is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'PurchaseController::show is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function update(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'PurchaseController::update is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function destroy(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'PurchaseController::destroy is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function receive(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'PurchaseController::receive is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function pay(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'PurchaseController::pay is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
