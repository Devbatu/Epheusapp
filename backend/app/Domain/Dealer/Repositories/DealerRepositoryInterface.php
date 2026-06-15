<?php

namespace App\Domain\Dealer\Repositories;

use App\Domain\Dealer\Models\Dealer;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface DealerRepositoryInterface
{
    public function all(): Collection;

    public function paginate(int $perPage = 20): LengthAwarePaginator;

    public function find(string $id): ?Dealer;

    public function create(array $data): Dealer;

    public function update(string $id, array $data): Dealer;

    public function delete(string $id): bool;
}