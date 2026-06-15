<?php

namespace App\Domain\Branch\Repositories;

use App\Domain\Branch\Models\Branch;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BranchRepository implements BranchRepositoryInterface
{
    public function all(): Collection
    {
        return Branch::query()->latest()->get();
    }

    public function paginate(int $perPage = 20): LengthAwarePaginator
    {
        return Branch::query()->latest()->paginate($perPage);
    }

    public function find(string $id): ?Branch
    {
        return Branch::find($id);
    }

    public function create(array $data): Branch
    {
        return Branch::create($data);
    }

    public function update(string $id, array $data): Branch
    {
        $model = Branch::findOrFail($id);
        $model->update($data);

        return $model->fresh();
    }

    public function delete(string $id): bool
    {
        return (bool) Branch::findOrFail($id)->delete();
    }
}