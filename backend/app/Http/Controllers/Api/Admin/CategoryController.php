<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Domain\Product\Models\Product;
use App\Domain\Product\Models\ProductCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(['data' => ProductCategory::withCount('products')->orderBy('name')->get()]);
    }

    public function publicIndex(Request $request): JsonResponse
    {
        $categories = ProductCategory::query()
            ->where('is_active', true)
            ->withCount(['products' => fn ($q) => $q->where('status', 'active')])
            ->orderBy('name')
            ->get()
            ->map(fn ($c) => [
                'id'             => $c->id,
                'name'           => $c->name,
                'slug'           => $c->slug,
                'products_count' => $c->products_count,
            ]);

        return response()->json(['data' => $categories]);
    }

    public function products(Request $request, string $slug): JsonResponse
    {
        $category = ProductCategory::where('slug', $slug)->firstOrFail();

        $products = Product::with('brand')
            ->where('category_id', $category->id)
            ->where('status', 'active')
            ->paginate($request->get('per_page', 12));

        return response()->json($products);
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Not implemented yet.'], 501);
    }

    public function show(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Not implemented yet.'], 501);
    }

    public function update(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Not implemented yet.'], 501);
    }

    public function destroy(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Not implemented yet.'], 501);
    }
}
