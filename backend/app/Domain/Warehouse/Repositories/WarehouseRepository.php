<?php

namespace App\Domain\Warehouse\Repositories;

use App\Domain\Warehouse\Models\Warehouse;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class WarehouseRepository implements WarehouseRepositoryInterface
{
    public function all(): Collection
    {
        return Warehouse::query()->latest()->get();
    }

    public function paginate(int $perPage = 20): LengthAwarePaginator
    {
        return Warehouse::query()->latest()->paginate($perPage);
    }

    public function find(string $id): ?Warehouse
    {
        return Warehouse::find($id);
    }

    public function create(array $data): Warehouse
    {
        return Warehouse::create($data);
    }

    public function update(string $id, array $data): Warehouse
    {
        $model = Warehouse::findOrFail($id);
        $model->update($data);

        return $model->fresh();
    }

    public function delete(string $id): bool
    {
        return (bool) Warehouse::findOrFail($id)->delete();
    }
}