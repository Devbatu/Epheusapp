<?php

namespace App\Domain\Warehouse\Repositories;

use App\Domain\Warehouse\Models\Warehouse;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface WarehouseRepositoryInterface
{
    public function all(): Collection;

    public function paginate(int $perPage = 20): LengthAwarePaginator;

    public function find(string $id): ?Warehouse;

    public function create(array $data): Warehouse;

    public function update(string $id, array $data): Warehouse;

    public function delete(string $id): bool;
}