<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SupplierController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $suppliers = DB::table('suppliers')
            ->whereNull('deleted_at')
            ->when($request->input('search'), fn ($q, $s) => $q
                ->whereRaw('LOWER(name) LIKE ?', ['%' . mb_strtolower($s) . '%']))
            ->orderBy('name')
            ->paginate($request->input('per_page', 20));

        return response()->json($suppliers);
    }

    public function store(Request $request): JsonResponse { return response()->json(['message' => 'Not implemented yet.'], 501); }
    public function show(Request $request): JsonResponse { return response()->json(['message' => 'Not implemented yet.'], 501); }
    public function update(Request $request): JsonResponse { return response()->json(['message' => 'Not implemented yet.'], 501); }
    public function destroy(Request $request): JsonResponse { return response()->json(['message' => 'Not implemented yet.'], 501); }
}
