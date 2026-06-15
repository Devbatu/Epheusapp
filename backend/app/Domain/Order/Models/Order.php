<?php

namespace App\Domain\Order\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Branch\Models\Branch;
use App\Domain\Warehouse\Models\Warehouse;
use App\Domain\Dealer\Models\Dealer;

class Order extends Model
{
    use HasUuids, HasFactory, SoftDeletes;

    const STATUS_DRAFT      = 'draft';
    const STATUS_PENDING    = 'pending';
    const STATUS_CONFIRMED  = 'confirmed';
    const STATUS_PROCESSING = 'processing';
    const STATUS_PACKED     = 'packed';
    const STATUS_SHIPPED    = 'shipped';
    const STATUS_DELIVERED  = 'delivered';
    const STATUS_RETURNED   = 'returned';
    const STATUS_CANCELLED  = 'cancelled';

    const CHANNEL_CUSTOMER = 'customer';
    const CHANNEL_DEALER   = 'dealer';
    const CHANNEL_BRANCH   = 'branch';
    const CHANNEL_POS      = 'pos';

    protected $fillable = [
        'order_number', 'channel', 'branch_id', 'warehouse_id',
        'customer_id', 'dealer_id', 'placed_by', 'status',
        'subtotal', 'discount_amount', 'discount_rate', 'tax_amount',
        'shipping_amount', 'total', 'currency',
        'shipping_method', 'shipping_carrier', 'tracking_number', 'shipping_address',
        'shipped_at', 'delivered_at', 'estimated_delivery',
        'payment_method', 'payment_status', 'paid_at',
        'notes', 'internal_notes', 'cancel_reason', 'cancelled_at',
    ];

    protected $casts = [
        'subtotal'         => 'decimal:2',
        'discount_amount'  => 'decimal:2',
        'discount_rate'    => 'decimal:2',
        'tax_amount'       => 'decimal:2',
        'shipping_amount'  => 'decimal:2',
        'total'            => 'decimal:2',
        'shipping_address' => 'array',
        'shipped_at'       => 'datetime',
        'delivered_at'     => 'datetime',
        'estimated_delivery' => 'datetime',
        'paid_at'          => 'datetime',
        'cancelled_at'     => 'datetime',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function dealer(): BelongsTo
    {
        return $this->belongsTo(Dealer::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeForBranch($query, string $branchId)
    {
        return $query->where('branch_id', $branchId);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByChannel($query, string $channel)
    {
        return $query->where('channel', $channel);
    }

    public function isCustomerOrder(): bool { return $this->channel === self::CHANNEL_CUSTOMER; }
    public function isDealerOrder(): bool   { return $this->channel === self::CHANNEL_DEALER; }
    public function isCancellable(): bool
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_CONFIRMED]);
    }
}
