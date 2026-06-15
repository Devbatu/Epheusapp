<?php

namespace App\Http\Controllers\Api\Branch;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockMovementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'StockMovementController::index is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'StockMovementController::show is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
