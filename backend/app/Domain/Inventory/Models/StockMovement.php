<?php

namespace App\Domain\Inventory\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use App\Domain\Branch\Models\Branch;
use App\Domain\Warehouse\Models\Warehouse;
use App\Domain\Product\Models\Product;

class StockMovement extends Model
{
    use HasUuids;

    // Movements are never updated — append-only ledger
    public $timestamps = false;

    protected $fillable = [
        'branch_id', 'warehouse_id', 'product_id', 'variant_id', 'batch_id',
        'type', 'quantity', 'quantity_before', 'quantity_after',
        'unit_cost', 'reference_id', 'reference_type',
        'performed_by', 'notes', 'moved_at',
    ];

    protected $casts = [
        'quantity'        => 'integer',
        'quantity_before' => 'integer',
        'quantity_after'  => 'integer',
        'unit_cost'       => 'decimal:4',
        'moved_at'        => 'datetime',
    ];

    public static function booted(): void
    {
        // Prevent updates to the ledger
        static::updating(function () {
            throw new \LogicException('Stock movements are immutable.');
        });

        static::deleting(function () {
            throw new \LogicException('Stock movements cannot be deleted.');
        });
    }

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

    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    public function isInbound(): bool
    {
        return $this->quantity > 0;
    }

    public function isOutbound(): bool
    {
        return $this->quantity < 0;
    }
}
