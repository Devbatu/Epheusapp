<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Domain\Branch\Models\Branch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $branches = Branch::query()
            ->withCount('warehouses')
            ->when($request->get('search'), fn ($q, $s) => $q
                ->whereRaw('LOWER(name) LIKE ?', ['%' . mb_strtolower($s) . '%'])
                ->orWhereRaw('LOWER(code) LIKE ?', ['%' . mb_strtolower($s) . '%']))
            ->when($request->get('status'), fn ($q, $s) => $q->where('status', $s))
            ->orderBy('code')
            ->paginate($request->get('per_page', 20));

        return response()->json($branches);
    }

    public function show(string $id): JsonResponse
    {
        $branch = Branch::withCount('warehouses')->findOrFail($id);

        return response()->json(['data' => $branch]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'code'    => ['required', 'string', 'max:10', 'unique:branches,code'],
            'city'    => ['required', 'string'],
            'address' => ['required', 'string'],
            'country' => ['nullable', 'string', 'size:2'],
            'phone'   => ['nullable', 'string'],
            'email'   => ['nullable', 'email'],
        ]);
        $data['slug']    = \Illuminate\Support\Str::slug($data['name']);
        $data['country'] = $data['country'] ?? 'TR';
        $data['status']  = 'active';

        $branch = Branch::create($data);

        return response()->json(['message' => 'Branch created.', 'data' => $branch], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $branch = Branch::findOrFail($id);
        $branch->update($request->only(['name', 'city', 'district', 'address', 'phone', 'email', 'manager_name']));

        return response()->json(['message' => 'Branch updated.', 'data' => $branch]);
    }

    public function destroy(string $id): JsonResponse
    {
        Branch::findOrFail($id)->delete();

        return response()->json(['message' => 'Branch deleted.']);
    }

    public function toggleStatus(string $id): JsonResponse
    {
        $branch = Branch::findOrFail($id);
        $branch->update(['status' => $branch->status === 'active' ? 'inactive' : 'active']);

        return response()->json(['message' => 'Status updated.', 'data' => $branch]);
    }

    public function dashboard(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Not implemented yet.'], 501);
    }

    public function performance(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Not implemented yet.'], 501);
    }
}
