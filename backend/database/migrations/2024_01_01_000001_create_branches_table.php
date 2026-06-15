<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('branches', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('code', 10)->unique(); // e.g. BR-001
            $table->enum('type', ['flagship', 'standard', 'kiosk', 'warehouse_only'])->default('standard');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->string('country', 2)->default('TR'); // ISO 3166-1 alpha-2
            $table->string('city');
            $table->string('district')->nullable();
            $table->text('address');
            $table->string('postal_code', 20)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('manager_name')->nullable();
            $table->json('settings')->default('{}'); // Branch-specific config
            $table->json('working_hours')->default('{}');
            $table->integer('sort_order')->default(0);
            $table->uuid('region_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'country']);
            $table->index('slug');
            $table->index('code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('branches');
    }
};


