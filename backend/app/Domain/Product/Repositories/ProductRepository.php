<?php

namespace App\Domain\Product\Repositories;

use App\Domain\Product\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductRepository implements ProductRepositoryInterface
{
    public function all(): Collection
    {
        return Product::query()->latest()->get();
    }

    public function paginate(int $perPage = 20): LengthAwarePaginator
    {
        return Product::query()->latest()->paginate($perPage);
    }

    public function find(string $id): ?Product
    {
        return Product::find($id);
    }

    public function create(array $data): Product
    {
        return Product::create($data);
    }

    public function update(string $id, array $data): Product
    {
        $model = Product::findOrFail($id);
        $model->update($data);

        return $model->fresh();
    }

    public function delete(string $id): bool
    {
        return (bool) Product::findOrFail($id)->delete();
    }
}