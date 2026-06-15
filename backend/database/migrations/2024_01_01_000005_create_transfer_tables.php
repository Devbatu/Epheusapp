<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transfer_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('transfer_number')->unique(); // TRF-2024-001
            $table->uuid('from_branch_id');
            $table->uuid('to_branch_id');
            $table->uuid('from_warehouse_id');
            $table->uuid('to_warehouse_id');
            $table->enum('status', [
                'pending',
                'approved',
                'rejected',
                'shipped',
                'received',
                'cancelled',
            ])->default('pending');
            $table->uuid('requested_by');
            $table->uuid('approved_by')->nullable();
            $table->uuid('shipped_by')->nullable();
            $table->uuid('received_by')->nullable();
            $table->text('notes')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('received_at')->nullable();
            $table->timestamp('expected_arrival')->nullable();
            $table->string('shipping_carrier')->nullable();
            $table->string('tracking_number')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('from_branch_id')->references('id')->on('branches');
            $table->foreign('to_branch_id')->references('id')->on('branches');
            $table->foreign('from_warehouse_id')->references('id')->on('warehouses');
            $table->foreign('to_warehouse_id')->references('id')->on('warehouses');
            $table->index(['from_branch_id', 'status']);
            $table->index(['to_branch_id', 'status']);
            $table->index('transfer_number');
            $table->index('status');
        });

        Schema::create('transfer_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('transfer_request_id');
            $table->uuid('product_id');
            $table->uuid('variant_id')->nullable();
            $table->uuid('batch_id')->nullable();
            $table->integer('requested_quantity');
            $table->integer('approved_quantity')->nullable();
            $table->integer('shipped_quantity')->nullable();
            $table->integer('received_quantity')->nullable();
            $table->decimal('unit_cost', 12, 4)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('transfer_request_id')->references('id')->on('transfer_requests')->cascadeOnDelete();
            $table->foreign('product_id')->references('id')->on('products');
            $table->foreign('variant_id')->references('id')->on('product_variants')->nullOnDelete();
            $table->foreign('batch_id')->references('id')->on('batches')->nullOnDelete();
            $table->index('transfer_request_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transfer_items');
        Schema::dropIfExists('transfer_requests');
    }
};


