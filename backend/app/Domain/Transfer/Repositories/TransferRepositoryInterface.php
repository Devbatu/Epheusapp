<?php

namespace App\Domain\Transfer\Repositories;

use App\Domain\Transfer\Models\TransferRequest;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface TransferRepositoryInterface
{
    public function all(): Collection;

    public function paginate(int $perPage = 20): LengthAwarePaginator;

    public function find(string $id): ?TransferRequest;

    public function create(array $data): TransferRequest;

    public function update(string $id, array $data): TransferRequest;

    public function delete(string $id): bool;
}