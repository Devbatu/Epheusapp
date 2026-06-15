<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Brands
        Schema::create('brands', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        // Product Categories (self-referencing for subcategories)
        Schema::create('product_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('parent_id')->nullable();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->integer('depth')->default(0); // 0=root, 1=sub
            $table->string('path')->nullable(); // materialized path e.g. /uuid/uuid
            $table->timestamps();
            $table->softDeletes();

            $table->index(['parent_id', 'is_active']);
            $table->index('path');
        });

        // Self-referencing FK added separately so the PK exists first (PostgreSQL)
        Schema::table('product_categories', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('product_categories')->nullOnDelete();
        });

        // Product Attribute Definitions
        Schema::create('product_attributes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); // e.g. Size, Weight, Flavor
            $table->string('type', 20)->default('select'); // select, text, number, boolean
            $table->boolean('is_filterable')->default(false);
            $table->boolean('is_required')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Products
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('brand_id')->nullable();
            $table->uuid('category_id');
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->unique();
            $table->string('barcode')->nullable()->unique();
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            $table->enum('type', ['simple', 'variant', 'bundle'])->default('simple');
            $table->enum('status', ['active', 'inactive', 'draft'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->boolean('requires_batch_tracking')->default(false);
            $table->boolean('requires_lot_tracking')->default(false);
            $table->boolean('has_expiration')->default(false);
            $table->integer('expiration_alert_days')->default(30);
            $table->decimal('base_price', 12, 2);
            $table->decimal('cost_price', 12, 2)->nullable();
            $table->decimal('b2b_price', 12, 2)->nullable();
            $table->string('unit', 20)->default('piece'); // piece, kg, liter, box
            $table->decimal('weight', 10, 3)->nullable();
            $table->json('dimensions')->nullable(); // {length, width, height}
            $table->string('origin_country', 2)->nullable();
            $table->integer('min_order_qty')->default(1);
            $table->integer('min_stock_alert')->default(10);
            $table->decimal('tax_rate', 5, 2)->default(18.00);
            $table->json('meta')->nullable(); // SEO meta
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('brand_id')->references('id')->on('brands')->nullOnDelete();
            $table->foreign('category_id')->references('id')->on('product_categories');
            $table->index(['status', 'category_id']);
            $table->index(['is_featured', 'status']);
            $table->index('sku');
            $table->index('barcode');
        });

        // Full-text search index (driver-specific; created after the table exists)
        $driver = Schema::getConnection()->getDriverName();
        if ($driver === 'pgsql') {
            DB::statement('CREATE INDEX products_name_fts ON products USING gin(to_tsvector(\'english\', name))');
        } elseif ($driver === 'mysql') {
            DB::statement('CREATE FULLTEXT INDEX products_name_fts ON products (name)');
        }

        // Product Variants
        Schema::create('product_variants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('product_id');
            $table->string('name');
            $table->string('sku')->unique();
            $table->string('barcode')->nullable()->unique();
            $table->decimal('price', 12, 2)->nullable(); // overrides product base_price if set
            $table->decimal('cost_price', 12, 2)->nullable();
            $table->decimal('weight', 10, 3)->nullable();
            $table->json('attributes'); // {"size": "500g", "flavor": "original"}
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();
            $table->index(['product_id', 'status']);
        });

        // Productâ€“Attribute mapping
        Schema::create('product_attribute_values', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('product_id');
            $table->uuid('attribute_id');
            $table->string('value');
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();
            $table->foreign('attribute_id')->references('id')->on('product_attributes')->cascadeOnDelete();
            $table->unique(['product_id', 'attribute_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_attribute_values');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('products');
        Schema::dropIfExists('product_attributes');
        Schema::dropIfExists('product_categories');
        Schema::dropIfExists('brands');
    }
};



