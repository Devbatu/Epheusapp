<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('payment_number')->unique();
            $table->uuid('branch_id');
            $table->nullableUuidMorphs('payable'); // Order, PurchaseOrder
            $table->uuid('received_by')->nullable();
            $table->enum('direction', ['inbound', 'outbound']); // inbound = received, outbound = paid
            $table->enum('method', ['cash', 'card', 'bank_transfer', 'online', 'credit'])->nullable();
            $table->decimal('amount', 14, 2);
            $table->string('currency', 3)->default('TRY');
            $table->decimal('exchange_rate', 10, 6)->default(1);
            $table->string('reference_number')->nullable(); // bank ref, receipt number
            $table->string('bank_name')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('paid_at');
            $table->timestamps();

            $table->foreign('branch_id')->references('id')->on('branches');
            $table->index(['branch_id', 'direction', 'paid_at']);
        });

        Schema::create('finance_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('branch_id');
            $table->enum('type', ['income', 'expense']);
            $table->string('category'); // sales, rent, salary, utilities, marketing, etc.
            $table->string('sub_category')->nullable();
            $table->decimal('amount', 14, 2);
            $table->string('currency', 3)->default('TRY');
            $table->string('description');
            $table->uuid('reference_id')->nullable(); // linked order, payment, etc.
            $table->string('reference_type')->nullable();
            $table->uuid('created_by');
            $table->date('transaction_date');
            $table->timestamps();

            $table->foreign('branch_id')->references('id')->on('branches');
            $table->index(['branch_id', 'type', 'transaction_date']);
            $table->index(['branch_id', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('finance_transactions');
        Schema::dropIfExists('payments');
    }
};



