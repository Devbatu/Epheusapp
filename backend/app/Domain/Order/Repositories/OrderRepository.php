<?php

namespace App\Domain\Order\Repositories;

use App\Domain\Order\Models\Order;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class OrderRepository implements OrderRepositoryInterface
{
    public function all(): Collection
    {
        return Order::query()->latest()->get();
    }

    public function paginate(int $perPage = 20): LengthAwarePaginator
    {
        return Order::query()->latest()->paginate($perPage);
    }

    public function find(string $id): ?Order
    {
        return Order::find($id);
    }

    public function create(array $data): Order
    {
        return Order::create($data);
    }

    public function update(string $id, array $data): Order
    {
        $model = Order::findOrFail($id);
        $model->update($data);

        return $model->fresh();
    }

    public function delete(string $id): bool
    {
        return (bool) Order::findOrFail($id)->delete();
    }
}