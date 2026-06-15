<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function stock(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'ReportController::stock is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function sales(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'ReportController::sales is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function branchPerformance(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'ReportController::branchPerformance is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function transfers(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'ReportController::transfers is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function profitability(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'ReportController::profitability is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function dealerSales(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'ReportController::dealerSales is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function export(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'ReportController::export is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
