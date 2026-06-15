<?php

namespace App\Domain\Order\Repositories;

use App\Domain\Order\Models\Order;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface OrderRepositoryInterface
{
    public function all(): Collection;

    public function paginate(int $perPage = 20): LengthAwarePaginator;

    public function find(string $id): ?Order;

    public function create(array $data): Order;

    public function update(string $id, array $data): Order;

    public function delete(string $id): bool;
}