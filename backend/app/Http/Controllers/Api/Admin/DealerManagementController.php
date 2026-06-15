<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DealerManagementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'DealerManagementController::index is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'DealerManagementController::show is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function approve(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'DealerManagementController::approve is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function reject(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'DealerManagementController::reject is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function updatePricing(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'DealerManagementController::updatePricing is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function updateCredit(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'DealerManagementController::updateCredit is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
