<?php

namespace App\Domain\Transfer\Services;

use App\Domain\Transfer\Models\TransferRequest;
use App\Domain\Transfer\Events\TransferApproved;
use App\Domain\Transfer\Events\TransferShipped;
use App\Domain\Transfer\Events\TransferReceived;
use App\Domain\Inventory\Services\StockService;
use App\Domain\Transfer\Repositories\TransferRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Validation\ValidationException;

class TransferService
{
    public function __construct(
        private readonly TransferRepositoryInterface $repository,
        private readonly StockService $stockService,
    ) {}

    public function createTransfer(array $data, string $requestedBy): TransferRequest
    {
        return DB::transaction(function () use ($data, $requestedBy) {
            // Verify stock availability for all items
            foreach ($data['items'] as $item) {
                $available = $this->stockService->getAvailableQuantity(
                    $data['from_warehouse_id'],
                    $item['product_id'],
                    $item['variant_id'] ?? null,
                );

                if ($available < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => "Insufficient stock for product {$item['product_id']}. Available: {$available}",
                    ]);
                }
            }

            $transfer = $this->repository->create([
                ...$data,
                'transfer_number' => $this->generateTransferNumber(),
                'requested_by'   => $requestedBy,
                'status'         => TransferRequest::STATUS_PENDING,
            ]);

            // Reserve stock at source warehouse
            foreach ($data['items'] as $item) {
                $this->stockService->reserveStock(
                    $data['from_warehouse_id'],
                    $item['product_id'],
                    $item['quantity'],
                    $item['variant_id'] ?? null,
                );
            }

            return $transfer;
        });
    }

    public function approve(TransferRequest $transfer, string $approvedBy): TransferRequest
    {
        if (! $transfer->isPending()) {
            throw ValidationException::withMessages(['status' => 'Only pending transfers can be approved.']);
        }

        $transfer->update([
            'status'      => TransferRequest::STATUS_APPROVED,
            'approved_by' => $approvedBy,
            'approved_at' => now(),
        ]);

        Event::dispatch(new TransferApproved($transfer));

        return $transfer->fresh();
    }

    public function reject(TransferRequest $transfer, string $rejectedBy, string $reason): TransferRequest
    {
        if (! $transfer->isPending()) {
            throw ValidationException::withMessages(['status' => 'Only pending transfers can be rejected.']);
        }

        DB::transaction(function () use ($transfer, $rejectedBy, $reason) {
            $transfer->update([
                'status'           => TransferRequest::STATUS_REJECTED,
                'rejection_reason' => $reason,
            ]);

            // Release reserved stock
            foreach ($transfer->items as $item) {
                $this->stockService->releaseReservedStock(
                    $transfer->from_warehouse_id,
                    $item->product_id,
                    $item->requested_quantity,
                    $item->variant_id,
                );
            }
        });

        return $transfer->fresh();
    }

    public function ship(TransferRequest $transfer, string $shippedBy, array $data): TransferRequest
    {
        if (! $transfer->isApproved()) {
            throw ValidationException::withMessages(['status' => 'Only approved transfers can be shipped.']);
        }

        DB::transaction(function () use ($transfer, $shippedBy, $data) {
            foreach ($transfer->items as $item) {
                $shippedQty = $data['items'][$item->id]['shipped_quantity'] ?? $item->approved_quantity;
                $item->update(['shipped_quantity' => $shippedQty]);

                // Deduct stock from source warehouse
                $this->stockService->deductStock(
                    $transfer->from_warehouse_id,
                    $item->product_id,
                    $shippedQty,
                    $item->variant_id,
                    $item->batch_id,
                    'transfer_out',
                    $transfer,
                    $shippedBy,
                );
            }

            $transfer->update([
                'status'           => TransferRequest::STATUS_SHIPPED,
                'shipped_by'       => $shippedBy,
                'shipped_at'       => now(),
                'shipping_carrier' => $data['shipping_carrier'] ?? null,
                'tracking_number'  => $data['tracking_number'] ?? null,
            ]);
        });

        Event::dispatch(new TransferShipped($transfer));

        return $transfer->fresh();
    }

    public function receive(TransferRequest $transfer, string $receivedBy, array $data): TransferRequest
    {
        if (! $transfer->isShipped()) {
            throw ValidationException::withMessages(['status' => 'Only shipped transfers can be received.']);
        }

        DB::transaction(function () use ($transfer, $receivedBy, $data) {
            foreach ($transfer->items as $item) {
                $receivedQty = $data['items'][$item->id]['received_quantity'] ?? $item->shipped_quantity;
                $item->update(['received_quantity' => $receivedQty]);

                // Add stock at destination warehouse
                $this->stockService->addStock(
                    $transfer->to_warehouse_id,
                    $item->product_id,
                    $receivedQty,
                    $item->variant_id,
                    $item->batch_id,
                    'transfer_in',
                    $transfer,
                    $receivedBy,
                );
            }

            $transfer->update([
                'status'      => TransferRequest::STATUS_RECEIVED,
                'received_by' => $receivedBy,
                'received_at' => now(),
            ]);
        });

        Event::dispatch(new TransferReceived($transfer));

        return $transfer->fresh();
    }

    private function generateTransferNumber(): string
    {
        $year  = now()->format('Y');
        $month = now()->format('m');
        $count = TransferRequest::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)->count() + 1;

        return sprintf('TRF-%s%s-%05d', $year, $month, $count);
    }
}
