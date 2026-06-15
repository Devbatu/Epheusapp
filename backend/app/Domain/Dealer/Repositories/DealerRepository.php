<?php

namespace App\Domain\Dealer\Repositories;

use App\Domain\Dealer\Models\Dealer;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DealerRepository implements DealerRepositoryInterface
{
    public function all(): Collection
    {
        return Dealer::query()->latest()->get();
    }

    public function paginate(int $perPage = 20): LengthAwarePaginator
    {
        return Dealer::query()->latest()->paginate($perPage);
    }

    public function find(string $id): ?Dealer
    {
        return Dealer::find($id);
    }

    public function create(array $data): Dealer
    {
        return Dealer::create($data);
    }

    public function update(string $id, array $data): Dealer
    {
        $model = Dealer::findOrFail($id);
        $model->update($data);

        return $model->fresh();
    }

    public function delete(string $id): bool
    {
        return (bool) Dealer::findOrFail($id)->delete();
    }
}