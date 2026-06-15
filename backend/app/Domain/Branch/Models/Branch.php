<?php

namespace App\Domain\Branch\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Warehouse\Models\Warehouse;
use App\Domain\Inventory\Models\Stock;
use App\Domain\Transfer\Models\TransferRequest;
use App\Domain\Order\Models\Order;
use App\Domain\Purchase\Models\PurchaseOrder;
use App\Domain\Finance\Models\FinanceTransaction;

class Branch extends Model
{
    use HasUuids, HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'code', 'type', 'status',
        'country', 'city', 'district', 'address', 'postal_code',
        'latitude', 'longitude', 'phone', 'email', 'manager_name',
        'settings', 'working_hours', 'sort_order', 'region_id',
    ];

    protected $casts = [
        'settings'      => 'array',
        'working_hours' => 'array',
        'latitude'      => 'decimal:8',
        'longitude'     => 'decimal:8',
        'sort_order'    => 'integer',
    ];

    // ─── Relationships ──────────────────────────────────────────────────────

    public function warehouses(): HasMany
    {
        return $this->hasMany(Warehouse::class);
    }

    public function defaultWarehouse(): ?Warehouse
    {
        return $this->warehouses()->where('is_default', true)->first();
    }

    public function stocks(): HasMany
    {
        return $this->hasMany(Stock::class);
    }

    public function outgoingTransfers(): HasMany
    {
        return $this->hasMany(TransferRequest::class, 'from_branch_id');
    }

    public function incomingTransfers(): HasMany
    {
        return $this->hasMany(TransferRequest::class, 'to_branch_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function financeTransactions(): HasMany
    {
        return $this->hasMany(FinanceTransaction::class);
    }

    // ─── Scopes ────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByCountry($query, string $country)
    {
        return $query->where('country', $country);
    }

    // ─── Accessors ─────────────────────────────────────────────────────────

    public function getIsActiveAttribute(): bool
    {
        return $this->status === 'active';
    }

    public function getFullAddressAttribute(): string
    {
        return implode(', ', array_filter([
            $this->address,
            $this->district,
            $this->city,
            $this->country,
        ]));
    }
}
