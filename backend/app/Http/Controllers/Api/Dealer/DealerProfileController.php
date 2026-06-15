<?php

namespace App\Http\Controllers\Api\Dealer;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DealerProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'DealerProfileController::show is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function update(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'DealerProfileController::update is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function creditInfo(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'DealerProfileController::creditInfo is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
