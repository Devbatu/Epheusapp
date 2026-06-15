<?php

namespace App\Http\Controllers\Api\Branch;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BranchDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'BranchDashboardController::index is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function kpis(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'BranchDashboardController::kpis is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
