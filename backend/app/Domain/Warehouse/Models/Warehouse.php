<?php

namespace App\Domain\Warehouse\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Branch\Models\Branch;
use App\Domain\Inventory\Models\Stock;
use App\Domain\Inventory\Models\StockMovement;

class Warehouse extends Model
{
    use HasUuids, HasFactory, SoftDeletes;

    protected $fillable = [
        'branch_id', 'name', 'code', 'type', 'status',
        'description', 'address', 'capacity', 'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'capacity'   => 'integer',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function stocks(): HasMany
    {
        return $this->hasMany(Stock::class);
    }

    public function movements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function getTotalStockValueAttribute(): float
    {
        return $this->stocks->sum(fn ($s) => $s->quantity * $s->average_cost);
    }
}
