<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('order_number')->unique(); // ORD-2024-000001
            $table->enum('channel', ['customer', 'dealer', 'branch', 'pos'])->default('customer');
            $table->uuid('branch_id')->nullable(); // fulfilling branch
            $table->uuid('warehouse_id')->nullable();
            $table->uuid('customer_id')->nullable();
            $table->uuid('dealer_id')->nullable();
            $table->uuid('placed_by'); // user_id who placed

            $table->enum('status', [
                'draft',
                'pending',
                'confirmed',
                'processing',
                'packed',
                'shipped',
                'delivered',
                'returned',
                'cancelled',
            ])->default('pending');

            // Pricing
            $table->decimal('subtotal', 14, 2)->default(0);
            $table->decimal('discount_amount', 14, 2)->default(0);
            $table->decimal('discount_rate', 5, 2)->default(0);
            $table->decimal('tax_amount', 14, 2)->default(0);
            $table->decimal('shipping_amount', 14, 2)->default(0);
            $table->decimal('total', 14, 2)->default(0);
            $table->string('currency', 3)->default('TRY');

            // Shipping
            $table->string('shipping_method')->nullable();
            $table->string('shipping_carrier')->nullable();
            $table->string('tracking_number')->nullable();
            $table->jsonb('shipping_address')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('estimated_delivery')->nullable();

            // Payment
            $table->enum('payment_method', ['cash', 'card', 'bank_transfer', 'credit', 'online'])->nullable();
            $table->enum('payment_status', ['pending', 'partial', 'paid', 'refunded', 'failed'])->default('pending');
            $table->timestamp('paid_at')->nullable();

            $table->text('notes')->nullable();
            $table->text('internal_notes')->nullable();
            $table->string('cancel_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('branch_id')->references('id')->on('branches')->nullOnDelete();
            $table->foreign('warehouse_id')->references('id')->on('warehouses')->nullOnDelete();
            $table->foreign('customer_id')->references('id')->on('customers')->nullOnDelete();
            $table->foreign('dealer_id')->references('id')->on('dealers')->nullOnDelete();

            $table->index(['status', 'channel']);
            $table->index(['branch_id', 'status']);
            $table->index(['customer_id', 'status']);
            $table->index(['dealer_id', 'status']);
            $table->index('order_number');
            $table->index('payment_status');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('order_id');
            $table->uuid('product_id');
            $table->uuid('variant_id')->nullable();
            $table->uuid('batch_id')->nullable();
            $table->string('product_name'); // snapshot at order time
            $table->string('variant_name')->nullable();
            $table->string('sku');
            $table->integer('quantity');
            $table->decimal('unit_price', 12, 2);
            $table->decimal('cost_price', 12, 2)->nullable();
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('subtotal', 14, 2);
            $table->enum('status', ['pending', 'confirmed', 'packed', 'shipped', 'returned'])->default('pending');
            $table->timestamps();

            $table->foreign('order_id')->references('id')->on('orders')->cascadeOnDelete();
            $table->foreign('product_id')->references('id')->on('products');
            $table->index('order_id');
        });

        Schema::create('carts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('customer_id')->nullable();
            $table->uuid('dealer_id')->nullable();
            $table->string('session_id')->nullable(); // for guest carts
            $table->decimal('total', 14, 2)->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index(['customer_id', 'expires_at']);
            $table->index('session_id');
        });

        Schema::create('cart_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('cart_id');
            $table->uuid('product_id');
            $table->uuid('variant_id')->nullable();
            $table->integer('quantity');
            $table->decimal('unit_price', 12, 2);
            $table->timestamps();

            $table->foreign('cart_id')->references('id')->on('carts')->cascadeOnDelete();
            $table->unique(['cart_id', 'product_id', 'variant_id']);
        });

        Schema::create('wishlists', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('customer_id');
            $table->uuid('product_id');
            $table->uuid('variant_id')->nullable();
            $table->timestamps();

            $table->foreign('customer_id')->references('id')->on('customers')->cascadeOnDelete();
            $table->unique(['customer_id', 'product_id', 'variant_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wishlists');
        Schema::dropIfExists('cart_items');
        Schema::dropIfExists('carts');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};


