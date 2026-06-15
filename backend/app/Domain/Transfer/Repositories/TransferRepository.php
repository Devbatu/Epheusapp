<?php

namespace App\Domain\Transfer\Repositories;

use App\Domain\Transfer\Models\TransferRequest;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TransferRepository implements TransferRepositoryInterface
{
    public function all(): Collection
    {
        return TransferRequest::query()->latest()->get();
    }

    public function paginate(int $perPage = 20): LengthAwarePaginator
    {
        return TransferRequest::query()->latest()->paginate($perPage);
    }

    public function find(string $id): ?TransferRequest
    {
        return TransferRequest::find($id);
    }

    public function create(array $data): TransferRequest
    {
        return TransferRequest::create($data);
    }

    public function update(string $id, array $data): TransferRequest
    {
        $model = TransferRequest::findOrFail($id);
        $model->update($data);

        return $model->fresh();
    }

    public function delete(string $id): bool
    {
        return (bool) TransferRequest::findOrFail($id)->delete();
    }
}