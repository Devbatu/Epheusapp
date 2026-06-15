<?php

namespace App\Domain\Inventory\Repositories;

use App\Domain\Inventory\Models\Stock;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface StockRepositoryInterface
{
    public function all(): Collection;

    public function paginate(int $perPage = 20): LengthAwarePaginator;

    public function find(string $id): ?Stock;

    public function create(array $data): Stock;

    public function update(string $id, array $data): Stock;

    public function delete(string $id): bool;
}