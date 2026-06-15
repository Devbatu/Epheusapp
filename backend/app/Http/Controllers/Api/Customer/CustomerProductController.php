<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Domain\Product\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()
            ->with(['brand', 'category'])
            ->where('status', 'active');

        if ($search = $request->get('search')) {
            $query->where(fn ($q) => $q
                ->where('name', 'ilike', "%{$search}%")
                ->orWhere('short_description', 'ilike', "%{$search}%"));
        }

        if ($category = $request->get('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        match ($request->get('sort')) {
            'price_asc'  => $query->orderBy('base_price'),
            'price_desc' => $query->orderByDesc('base_price'),
            'name'       => $query->orderBy('name'),
            default      => $query->orderByDesc('is_featured')->latest(),
        };

        $products = $query->paginate($request->get('per_page', 12));
        $products->getCollection()->transform(fn (Product $p) => $this->card($p));

        return response()->json($products);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::with(['brand', 'category', 'variants'])
            ->where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        $related = Product::with('brand')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('status', 'active')
            ->limit(4)
            ->get()
            ->map(fn (Product $p) => $this->card($p));

        return response()->json([
            'data' => [
                ...$this->card($product),
                'description' => $product->description,
                'barcode'     => $product->barcode,
                'unit'        => $product->unit,
                'origin'      => $product->origin_country,
                'tax_rate'    => (float) $product->tax_rate,
                'related'     => $related,
            ],
        ]);
    }

    private function card(Product $p): array
    {
        return [
            'id'          => $p->id,
            'name'        => $p->name,
            'slug'        => $p->slug,
            'sku'         => $p->sku,
            'price'       => (float) $p->base_price,
            'image_url'   => $p->meta['image'] ?? null,
            'brand'       => $p->brand?->name,
            'category'    => $p->category?->name,
            'category_slug' => $p->category?->slug,
            'is_featured' => $p->is_featured,
            'short_description' => $p->short_description,
        ];
    }
}
