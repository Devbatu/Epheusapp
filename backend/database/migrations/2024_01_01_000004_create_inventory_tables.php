<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Batches â€” for tracking raw material lots from suppliers
        Schema::create('batches', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('product_id');
            $table->uuid('variant_id')->nullable();
            $table->string('batch_number')->unique();
            $table->string('lot_number')->nullable();
            $table->uuid('supplier_id')->nullable();
            $table->date('manufacture_date')->nullable();
            $table->date('expiration_date')->nullable();
            $table->integer('initial_quantity')->default(0);
            $table->integer('remaining_quantity')->default(0);
            $table->enum('status', ['active', 'expired', 'recalled', 'depleted'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products');
            $table->foreign('variant_id')->references('id')->on('product_variants')->nullOnDelete();
            $table->index(['product_id', 'status']);
            $table->index('expiration_date');
            $table->index('batch_number');
        });

        // Stocks â€” current quantity per product per warehouse
        Schema::create('stocks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('branch_id');
            $table->uuid('warehouse_id');
            $table->uuid('product_id');
            $table->uuid('variant_id')->nullable();
            $table->uuid('batch_id')->nullable();
            $table->integer('quantity')->default(0);
            $table->integer('reserved_quantity')->default(0); // held for pending orders
            $table->integer('damaged_quantity')->default(0);
            $table->integer('returned_quantity')->default(0);
            $table->decimal('average_cost', 12, 4)->default(0); // weighted average cost
            $table->timestamps();

            $table->foreign('branch_id')->references('id')->on('branches');
            $table->foreign('warehouse_id')->references('id')->on('warehouses');
            $table->foreign('product_id')->references('id')->on('products');
            $table->foreign('variant_id')->references('id')->on('product_variants')->nullOnDelete();
            $table->foreign('batch_id')->references('id')->on('batches')->nullOnDelete();

            $table->unique(['warehouse_id', 'product_id', 'variant_id', 'batch_id'], 'stocks_unique');
            $table->index(['branch_id', 'product_id']);
            $table->index(['warehouse_id', 'quantity']);
        });

        // Stock Movements â€” every stock change is recorded here (append-only ledger)
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('branch_id');
            $table->uuid('warehouse_id');
            $table->uuid('product_id');
            $table->uuid('variant_id')->nullable();
            $table->uuid('batch_id')->nullable();
            $table->enum('type', [
                'purchase',       // stock in from supplier PO
                'sale',           // stock out from customer/dealer order
                'transfer_out',   // sent to another branch
                'transfer_in',    // received from another branch
                'adjustment',     // manual stock adjustment
                'damage',         // moved to damaged
                'return_in',      // customer return received
                'return_out',     // returned to supplier
                'opening',        // opening stock entry
            ]);
            $table->integer('quantity'); // positive = in, negative = out
            $table->integer('quantity_before');
            $table->integer('quantity_after');
            $table->decimal('unit_cost', 12, 4)->nullable();
            $table->nullableUuidMorphs('reference'); // polymorphic link to PO, Order, Transfer, etc.
            $table->uuid('performed_by');
            $table->text('notes')->nullable();
            $table->timestamp('moved_at');
            $table->timestamps();

            $table->foreign('branch_id')->references('id')->on('branches');
            $table->foreign('warehouse_id')->references('id')->on('warehouses');
            $table->foreign('product_id')->references('id')->on('products');
            $table->index(['branch_id', 'type', 'moved_at']);
            $table->index(['product_id', 'moved_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
        Schema::dropIfExists('stocks');
        Schema::dropIfExists('batches');
    }
};



