<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'CustomerOrderController::index is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'CustomerOrderController::show is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function store(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'CustomerOrderController::store is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function cancel(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'CustomerOrderController::cancel is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
