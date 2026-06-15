<?php

namespace App\Domain\Inventory\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Domain\Branch\Models\Branch;
use App\Domain\Warehouse\Models\Warehouse;
use App\Domain\Product\Models\Product;
use App\Domain\Product\Models\ProductVariant;

class Stock extends Model
{
    use HasUuids;

    protected $fillable = [
        'branch_id', 'warehouse_id', 'product_id', 'variant_id', 'batch_id',
        'quantity', 'reserved_quantity', 'damaged_quantity', 'returned_quantity', 'average_cost',
    ];

    protected $casts = [
        'quantity'          => 'integer',
        'reserved_quantity' => 'integer',
        'damaged_quantity'  => 'integer',
        'returned_quantity' => 'integer',
        'average_cost'      => 'decimal:4',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }

    public function getAvailableQuantityAttribute(): int
    {
        return max(0, $this->quantity - $this->reserved_quantity);
    }

    public function isLow(): bool
    {
        return $this->available_quantity <= ($this->product->min_stock_alert ?? 10);
    }

    public function scopeLowStock($query)
    {
        return $query->whereRaw('quantity <= (SELECT min_stock_alert FROM products WHERE id = product_id)');
    }
}
