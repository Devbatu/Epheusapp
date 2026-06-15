<?php

namespace App\Http\Controllers\Api\Branch;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'InventoryController::index is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'InventoryController::show is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function adjust(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'InventoryController::adjust is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function lowStock(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'InventoryController::lowStock is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function expiring(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'InventoryController::expiring is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function batchCreate(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'InventoryController::batchCreate is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
