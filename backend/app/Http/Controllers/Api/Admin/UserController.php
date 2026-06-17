<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Domain\User\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->with(['roles:id,name', 'branch:id,name,code'])
            ->when($request->input('search'), fn ($q, $s) => $q
                ->whereRaw('LOWER(name) LIKE ?', ['%' . mb_strtolower($s) . '%'])
                ->orWhereRaw('LOWER(email) LIKE ?', ['%' . mb_strtolower($s) . '%']))
            ->when($request->input('role'), fn ($q, $r) => $q->whereHas('roles', fn ($x) => $x->where('name', $r)))
            ->latest()
            ->paginate($request->input('per_page', 20));

        $users->getCollection()->transform(fn (User $u) => [
            'id'         => $u->id,
            'name'       => $u->name,
            'email'      => $u->email,
            'phone'      => $u->phone,
            'is_active'  => $u->is_active,
            'roles'      => $u->roles->pluck('name'),
            'branch'     => $u->branch?->name,
            'last_login_at' => $u->last_login_at?->toIso8601String(),
            'created_at' => $u->created_at?->toIso8601String(),
        ]);

        return response()->json($users);
    }

    public function store(Request $request): JsonResponse { return response()->json(['message' => 'Not implemented yet.'], 501); }
    public function show(Request $request): JsonResponse { return response()->json(['message' => 'Not implemented yet.'], 501); }
    public function update(Request $request): JsonResponse { return response()->json(['message' => 'Not implemented yet.'], 501); }
    public function destroy(Request $request): JsonResponse { return response()->json(['message' => 'Not implemented yet.'], 501); }
    public function assignRole(Request $request): JsonResponse { return response()->json(['message' => 'Not implemented yet.'], 501); }
    public function revokeRole(Request $request): JsonResponse { return response()->json(['message' => 'Not implemented yet.'], 501); }
}
