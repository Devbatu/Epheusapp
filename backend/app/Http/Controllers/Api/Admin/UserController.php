<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'UserController::index is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function store(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'UserController::store is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'UserController::show is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function update(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'UserController::update is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function destroy(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'UserController::destroy is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function assignRole(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'UserController::assignRole is not implemented yet.',
            'data'    => [],
        ], 501);
    }
    public function revokeRole(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'UserController::revokeRole is not implemented yet.',
            'data'    => [],
        ], 501);
    }
}
