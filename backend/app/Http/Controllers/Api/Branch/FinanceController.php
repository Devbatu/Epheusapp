<?php

namespace App\Http\Controllers\Api\Branch;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    public function summary(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'FinanceController::summary is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function incomeIndex(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'FinanceController::incomeIndex is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function storeIncome(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'FinanceController::storeIncome is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function expenseIndex(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'FinanceController::expenseIndex is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function storeExpense(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'FinanceController::storeExpense is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function cashFlow(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'FinanceController::cashFlow is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
