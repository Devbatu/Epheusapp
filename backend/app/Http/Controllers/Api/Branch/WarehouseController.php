<?php

namespace App\Http\Controllers\Api\Branch;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'WarehouseController::index is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function store(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'WarehouseController::store is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'WarehouseController::show is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function update(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'WarehouseController::update is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function destroy(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'WarehouseController::destroy is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function stock(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'WarehouseController::stock is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
