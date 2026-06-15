<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['male', 'female', 'other', 'prefer_not'])->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('email_verified')->default(false);
            $table->decimal('total_spent', 14, 2)->default(0);
            $table->integer('total_orders')->default(0);
            $table->json('preferences')->default('{}');
            $table->timestamp('last_order_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('email');
            $table->index('is_active');
        });

        Schema::create('customer_addresses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('customer_id');
            $table->string('label')->default('Home'); // Home, Work, Other
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone')->nullable();
            $table->string('country', 2)->default('TR');
            $table->string('city');
            $table->string('district')->nullable();
            $table->text('address_line1');
            $table->string('address_line2')->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->foreign('customer_id')->references('id')->on('customers')->cascadeOnDelete();
            $table->index(['customer_id', 'is_default']);
        });

        Schema::create('dealers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->unique();
            $table->string('company_name');
            $table->string('company_slug')->unique();
            $table->string('tax_number')->unique();
            $table->string('tax_office')->nullable();
            $table->string('contact_name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->text('address');
            $table->string('country', 2)->default('TR');
            $table->string('city');
            $table->enum('status', ['pending', 'approved', 'rejected', 'suspended'])->default('pending');
            $table->decimal('credit_limit', 14, 2)->default(0);
            $table->decimal('current_balance', 14, 2)->default(0); // outstanding debt
            $table->decimal('discount_rate', 5, 2)->default(0); // global % discount
            $table->integer('min_order_qty')->default(1);
            $table->integer('payment_terms_days')->default(30); // net 30
            $table->uuid('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->json('custom_pricing')->default('{}'); // product_id => price overrides
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status']);
            $table->index('tax_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dealers');
        Schema::dropIfExists('customer_addresses');
        Schema::dropIfExists('customers');
    }
};


