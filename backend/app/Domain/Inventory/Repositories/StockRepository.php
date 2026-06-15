<?php

namespace App\Domain\Inventory\Repositories;

use App\Domain\Inventory\Models\Stock;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StockRepository implements StockRepositoryInterface
{
    public function all(): Collection
    {
        return Stock::query()->latest()->get();
    }

    public function paginate(int $perPage = 20): LengthAwarePaginator
    {
        return Stock::query()->latest()->paginate($perPage);
    }

    public function find(string $id): ?Stock
    {
        return Stock::find($id);
    }

    public function create(array $data): Stock
    {
        return Stock::create($data);
    }

    public function update(string $id, array $data): Stock
    {
        $model = Stock::findOrFail($id);
        $model->update($data);

        return $model->fresh();
    }

    public function delete(string $id): bool
    {
        return (bool) Stock::findOrFail($id)->delete();
    }
}