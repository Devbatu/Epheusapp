<?php

namespace App\Domain\Branch\Repositories;

use App\Domain\Branch\Models\Branch;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface BranchRepositoryInterface
{
    public function all(): Collection;

    public function paginate(int $perPage = 20): LengthAwarePaginator;

    public function find(string $id): ?Branch;

    public function create(array $data): Branch;

    public function update(string $id, array $data): Branch;

    public function delete(string $id): bool;
}