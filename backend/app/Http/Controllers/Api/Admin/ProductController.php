<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Domain\Product\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()->with(['brand', 'category']);

        if ($search = $request->get('search')) {
            $term = '%' . mb_strtolower($search) . '%';
            $query->where(fn ($q) => $q
                ->whereRaw('LOWER(name) LIKE ?', [$term])
                ->orWhereRaw('LOWER(sku) LIKE ?', [$term]));
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        if ($categoryId = $request->get('category_id')) {
            $query->where('category_id', $categoryId);
        }

        $products = $query->latest()->paginate($request->get('per_page', 20));

        $products->getCollection()->transform(fn (Product $p) => $this->transform($p));

        return response()->json($products);
    }

    public function show(string $id): JsonResponse
    {
        $product = Product::with(['brand', 'category', 'variants'])->findOrFail($id);

        return response()->json(['data' => $this->transform($product)]);
    }

    private function transform(Product $p): array
    {
        return [
            'id'            => $p->id,
            'name'          => $p->name,
            'slug'          => $p->slug,
            'sku'           => $p->sku,
            'barcode'       => $p->barcode,
            'status'        => $p->status,
            'is_featured'   => $p->is_featured,
            'base_price'    => (float) $p->base_price,
            'b2b_price'     => (float) $p->b2b_price,
            'cost_price'    => (float) $p->cost_price,
            'unit'          => $p->unit,
            'tax_rate'      => (float) $p->tax_rate,
            'image_url'     => $p->meta['image'] ?? null,
            'brand'         => $p->brand?->name,
            'category'      => $p->category?->name,
            'short_description' => $p->short_description,
            'created_at'    => $p->created_at?->toIso8601String(),
        ];
    }

    public function store(Request $request): JsonResponse
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

    public function uploadImages(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Not implemented yet.'], 501);
    }

    public function deleteImage(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Not implemented yet.'], 501);
    }
}
