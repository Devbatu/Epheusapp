<?php

namespace App\Http\Controllers\Api\Dealer;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DealerProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'DealerProductController::index is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'DealerProductController::show is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
