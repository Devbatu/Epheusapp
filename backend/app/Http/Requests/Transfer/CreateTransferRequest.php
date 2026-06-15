<?php

namespace App\Http\Requests\Transfer;

use Illuminate\Foundation\Http\FormRequest;

class CreateTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('transfers.create');
    }

    public function rules(): array
    {
        return [
            'from_branch_id'    => ['required', 'uuid', 'exists:branches,id'],
            'to_branch_id'      => ['required', 'uuid', 'exists:branches,id', 'different:from_branch_id'],
            'from_warehouse_id' => ['required', 'uuid', 'exists:warehouses,id'],
            'to_warehouse_id'   => ['required', 'uuid', 'exists:warehouses,id'],
            'notes'             => ['nullable', 'string', 'max:1000'],
            'items'             => ['required', 'array', 'min:1'],
            'items.*.product_id'  => ['required', 'uuid', 'exists:products,id'],
            'items.*.variant_id'  => ['nullable', 'uuid', 'exists:product_variants,id'],
            'items.*.batch_id'    => ['nullable', 'uuid', 'exists:batches,id'],
            'items.*.quantity'    => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'to_branch_id.different' => 'Source and destination branches must be different.',
            'items.required'         => 'At least one item is required for transfer.',
        ];
    }
}
