<?php

namespace App\Domain\Transfer\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Branch\Models\Branch;
use App\Domain\Warehouse\Models\Warehouse;

class TransferRequest extends Model
{
    use HasUuids, HasFactory, SoftDeletes;

    protected $fillable = [
        'transfer_number', 'from_branch_id', 'to_branch_id',
        'from_warehouse_id', 'to_warehouse_id', 'status',
        'requested_by', 'approved_by', 'shipped_by', 'received_by',
        'notes', 'rejection_reason',
        'approved_at', 'shipped_at', 'received_at', 'expected_arrival',
        'shipping_carrier', 'tracking_number',
    ];

    protected $casts = [
        'approved_at'      => 'datetime',
        'shipped_at'       => 'datetime',
        'received_at'      => 'datetime',
        'expected_arrival' => 'datetime',
    ];

    const STATUS_PENDING   = 'pending';
    const STATUS_APPROVED  = 'approved';
    const STATUS_REJECTED  = 'rejected';
    const STATUS_SHIPPED   = 'shipped';
    const STATUS_RECEIVED  = 'received';
    const STATUS_CANCELLED = 'cancelled';

    public function fromBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'from_branch_id');
    }

    public function toBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'to_branch_id');
    }

    public function fromWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'from_warehouse_id');
    }

    public function toWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'to_warehouse_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(TransferItem::class);
    }

    // ─── Status checks ─────────────────────────────────────────────────────

    public function isPending(): bool    { return $this->status === self::STATUS_PENDING; }
    public function isApproved(): bool   { return $this->status === self::STATUS_APPROVED; }
    public function isShipped(): bool    { return $this->status === self::STATUS_SHIPPED; }
    public function isReceived(): bool   { return $this->status === self::STATUS_RECEIVED; }
    public function isCancellable(): bool
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_APPROVED]);
    }

    // ─── Scopes ────────────────────────────────────────────────────────────

    public function scopePending($query)   { return $query->where('status', self::STATUS_PENDING); }
    public function scopeApproved($query)  { return $query->where('status', self::STATUS_APPROVED); }
    public function scopeForBranch($query, string $branchId)
    {
        return $query->where('from_branch_id', $branchId)
            ->orWhere('to_branch_id', $branchId);
    }
}
