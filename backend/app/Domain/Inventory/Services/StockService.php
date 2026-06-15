<?php

namespace App\Domain\Inventory\Services;

use App\Domain\Inventory\Models\Stock;
use App\Domain\Inventory\Models\StockMovement;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class StockService
{
    public function getAvailableQuantity(
        string $warehouseId,
        string $productId,
        ?string $variantId = null,
    ): int {
        $stock = Stock::where('warehouse_id', $warehouseId)
            ->where('product_id', $productId)
            ->when($variantId, fn ($q) => $q->where('variant_id', $variantId))
            ->first();

        if (! $stock) {
            return 0;
        }

        return max(0, $stock->quantity - $stock->reserved_quantity);
    }

    public function addStock(
        string $warehouseId,
        string $productId,
        int $quantity,
        ?string $variantId,
        ?string $batchId,
        string $movementType,
        Model $reference,
        string $performedBy,
        ?string $notes = null,
    ): Stock {
        return DB::transaction(function () use (
            $warehouseId, $productId, $quantity, $variantId, $batchId,
            $movementType, $reference, $performedBy, $notes
        ) {
            $warehouse = \App\Domain\Warehouse\Models\Warehouse::findOrFail($warehouseId);

            $stock = Stock::firstOrCreate(
                [
                    'branch_id'    => $warehouse->branch_id,
                    'warehouse_id' => $warehouseId,
                    'product_id'   => $productId,
                    'variant_id'   => $variantId,
                    'batch_id'     => $batchId,
                ],
                ['quantity' => 0, 'reserved_quantity' => 0]
            );

            $before = $stock->quantity;
            $stock->increment('quantity', $quantity);

            $this->recordMovement(
                $stock,
                $movementType,
                $quantity,
                $before,
                $stock->fresh()->quantity,
                $reference,
                $performedBy,
                $notes,
            );

            return $stock->fresh();
        });
    }

    public function deductStock(
        string $warehouseId,
        string $productId,
        int $quantity,
        ?string $variantId,
        ?string $batchId,
        string $movementType,
        Model $reference,
        string $performedBy,
        ?string $notes = null,
    ): Stock {
        return DB::transaction(function () use (
            $warehouseId, $productId, $quantity, $variantId, $batchId,
            $movementType, $reference, $performedBy, $notes
        ) {
            $stock = Stock::where('warehouse_id', $warehouseId)
                ->where('product_id', $productId)
                ->when($variantId, fn ($q) => $q->where('variant_id', $variantId))
                ->when($batchId, fn ($q) => $q->where('batch_id', $batchId))
                ->lockForUpdate()
                ->firstOrFail();

            $before = $stock->quantity;
            $stock->decrement('quantity', $quantity);

            // Also release reservation
            if ($stock->reserved_quantity > 0) {
                $stock->decrement('reserved_quantity', min($quantity, $stock->reserved_quantity));
            }

            $this->recordMovement(
                $stock,
                $movementType,
                -$quantity,
                $before,
                $stock->fresh()->quantity,
                $reference,
                $performedBy,
                $notes,
            );

            return $stock->fresh();
        });
    }

    public function reserveStock(
        string $warehouseId,
        string $productId,
        int $quantity,
        ?string $variantId = null,
    ): void {
        Stock::where('warehouse_id', $warehouseId)
            ->where('product_id', $productId)
            ->when($variantId, fn ($q) => $q->where('variant_id', $variantId))
            ->lockForUpdate()
            ->firstOrFail()
            ->increment('reserved_quantity', $quantity);
    }

    public function releaseReservedStock(
        string $warehouseId,
        string $productId,
        int $quantity,
        ?string $variantId = null,
    ): void {
        Stock::where('warehouse_id', $warehouseId)
            ->where('product_id', $productId)
            ->when($variantId, fn ($q) => $q->where('variant_id', $variantId))
            ->firstOrFail()
            ->decrement('reserved_quantity', $quantity);
    }

    public function adjust(
        string $warehouseId,
        string $productId,
        int $newQuantity,
        string $performedBy,
        ?string $variantId = null,
        ?string $notes = null,
    ): Stock {
        return DB::transaction(function () use (
            $warehouseId, $productId, $newQuantity, $performedBy, $variantId, $notes
        ) {
            $warehouse = \App\Domain\Warehouse\Models\Warehouse::findOrFail($warehouseId);

            $stock = Stock::firstOrCreate(
                [
                    'branch_id'    => $warehouse->branch_id,
                    'warehouse_id' => $warehouseId,
                    'product_id'   => $productId,
                    'variant_id'   => $variantId,
                    'batch_id'     => null,
                ],
                ['quantity' => 0]
            );

            $before     = $stock->quantity;
            $difference = $newQuantity - $before;

            $stock->update(['quantity' => $newQuantity]);

            // Create a dummy reference-free movement for adjustment
            StockMovement::create([
                'branch_id'       => $stock->branch_id,
                'warehouse_id'    => $warehouseId,
                'product_id'      => $productId,
                'variant_id'      => $variantId,
                'type'            => 'adjustment',
                'quantity'        => $difference,
                'quantity_before' => $before,
                'quantity_after'  => $newQuantity,
                'performed_by'    => $performedBy,
                'notes'           => $notes,
                'moved_at'        => now(),
            ]);

            return $stock->fresh();
        });
    }

    private function recordMovement(
        Stock $stock,
        string $type,
        int $qty,
        int $before,
        int $after,
        Model $reference,
        string $performedBy,
        ?string $notes,
    ): void {
        StockMovement::create([
            'branch_id'       => $stock->branch_id,
            'warehouse_id'    => $stock->warehouse_id,
            'product_id'      => $stock->product_id,
            'variant_id'      => $stock->variant_id,
            'batch_id'        => $stock->batch_id,
            'type'            => $type,
            'quantity'        => $qty,
            'quantity_before' => $before,
            'quantity_after'  => $after,
            'reference_id'    => $reference->getKey(),
            'reference_type'  => $reference->getMorphClass(),
            'performed_by'    => $performedBy,
            'notes'           => $notes,
            'moved_at'        => now(),
        ]);
    }
}
