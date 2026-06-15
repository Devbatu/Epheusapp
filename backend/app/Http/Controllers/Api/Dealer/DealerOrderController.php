<?php

namespace App\Http\Controllers\Api\Dealer;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DealerOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'DealerOrderController::index is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function store(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'DealerOrderController::store is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'DealerOrderController::show is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function cancel(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'DealerOrderController::cancel is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
