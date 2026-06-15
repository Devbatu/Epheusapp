<?php

namespace App\Domain\Order\Services;

use App\Domain\Order\Models\Order;
use App\Domain\Order\Events\OrderConfirmed;
use App\Domain\Order\Events\OrderStatusChanged;
use App\Domain\Inventory\Services\StockService;
use App\Domain\Order\Repositories\OrderRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $repository,
        private readonly StockService $stockService,
    ) {}

    public function createCustomerOrder(array $data, string $customerId): Order
    {
        return DB::transaction(function () use ($data, $customerId) {
            $order = $this->repository->create([
                ...$data,
                'order_number' => $this->generateOrderNumber(),
                'customer_id'  => $customerId,
                'channel'      => 'customer',
                'status'       => Order::STATUS_PENDING,
            ]);

            foreach ($data['items'] as $item) {
                $order->items()->create($item);
                $this->stockService->reserveStock(
                    $data['warehouse_id'],
                    $item['product_id'],
                    $item['quantity'],
                    $item['variant_id'] ?? null,
                );
            }

            return $order->load('items');
        });
    }

    public function createDealerOrder(array $data, string $dealerId): Order
    {
        return DB::transaction(function () use ($data, $dealerId) {
            $dealer = \App\Domain\Dealer\Models\Dealer::findOrFail($dealerId);

            // Validate minimum order quantity and credit limit
            $orderTotal = collect($data['items'])->sum(fn ($i) => $i['quantity'] * $i['unit_price']);

            if ($dealer->current_balance + $orderTotal > $dealer->credit_limit && $data['payment_method'] === 'credit') {
                throw ValidationException::withMessages(['credit' => 'Credit limit exceeded.']);
            }

            return $this->repository->create([
                ...$data,
                'order_number' => $this->generateOrderNumber(),
                'dealer_id'    => $dealerId,
                'channel'      => 'dealer',
                'status'       => Order::STATUS_PENDING,
            ]);
        });
    }

    public function updateStatus(Order $order, string $status, string $performedBy): Order
    {
        $validTransitions = $this->getValidTransitions($order->status);

        if (! in_array($status, $validTransitions)) {
            throw ValidationException::withMessages([
                'status' => "Cannot transition from [{$order->status}] to [{$status}].",
            ]);
        }

        $oldStatus = $order->status;

        DB::transaction(function () use ($order, $status, $performedBy) {
            $updates = ['status' => $status];

            if ($status === Order::STATUS_SHIPPED) {
                $updates['shipped_at'] = now();
                $this->deductOrderStock($order, $performedBy);
            }

            if ($status === Order::STATUS_DELIVERED) {
                $updates['delivered_at'] = now();
            }

            if ($status === Order::STATUS_CANCELLED) {
                $updates['cancelled_at'] = now();
                $this->releaseOrderReservations($order);
            }

            $order->update($updates);
        });

        Event::dispatch(new OrderStatusChanged($order, $oldStatus, $status, $performedBy));

        return $order->fresh();
    }

    private function deductOrderStock(Order $order, string $performedBy): void
    {
        foreach ($order->items as $item) {
            $this->stockService->deductStock(
                $order->warehouse_id,
                $item->product_id,
                $item->quantity,
                $item->variant_id,
                $item->batch_id ?? null,
                'sale',
                $order,
                $performedBy,
            );
        }
    }

    private function releaseOrderReservations(Order $order): void
    {
        foreach ($order->items as $item) {
            $this->stockService->releaseReservedStock(
                $order->warehouse_id,
                $item->product_id,
                $item->quantity,
                $item->variant_id,
            );
        }
    }

    private function getValidTransitions(string $currentStatus): array
    {
        return match ($currentStatus) {
            'draft'      => ['pending', 'cancelled'],
            'pending'    => ['confirmed', 'cancelled'],
            'confirmed'  => ['processing', 'cancelled'],
            'processing' => ['packed', 'cancelled'],
            'packed'     => ['shipped'],
            'shipped'    => ['delivered', 'returned'],
            'delivered'  => ['returned'],
            default      => [],
        };
    }

    private function generateOrderNumber(): string
    {
        $year  = now()->format('Y');
        $count = Order::whereYear('created_at', $year)->count() + 1;

        return sprintf('ORD-%s-%06d', $year, $count);
    }
}
