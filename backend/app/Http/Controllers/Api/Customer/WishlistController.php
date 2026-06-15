<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'WishlistController::index is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function toggle(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'WishlistController::toggle is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
