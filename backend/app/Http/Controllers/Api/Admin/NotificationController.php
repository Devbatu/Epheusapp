<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function broadcast(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'NotificationController::broadcast is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'NotificationController::index is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
