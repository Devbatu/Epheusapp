<?php

namespace App\Domain\Dealer\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\User\Models\User;
use App\Domain\Order\Models\Order;

class Dealer extends Model
{
    use HasUuids, HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'company_name', 'company_slug', 'tax_number', 'tax_office',
        'contact_name', 'email', 'phone', 'address', 'country', 'city',
        'status', 'credit_limit', 'current_balance', 'discount_rate',
        'min_order_qty', 'payment_terms_days', 'approved_by', 'approved_at',
        'rejection_reason', 'custom_pricing',
    ];

    protected $casts = [
        'credit_limit'       => 'decimal:2',
        'current_balance'    => 'decimal:2',
        'discount_rate'      => 'decimal:2',
        'custom_pricing'     => 'array',
        'approved_at'        => 'datetime',
        'min_order_qty'      => 'integer',
        'payment_terms_days' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function isPending(): bool  { return $this->status === 'pending'; }
    public function isApproved(): bool { return $this->status === 'approved'; }

    public function getRemainingCreditAttribute(): float
    {
        return max(0, $this->credit_limit - $this->current_balance);
    }

    public function getPriceForProduct(string $productId, float $basePrice): float
    {
        if (isset($this->custom_pricing[$productId])) {
            return (float) $this->custom_pricing[$productId];
        }

        if ($this->discount_rate > 0) {
            return $basePrice * (1 - $this->discount_rate / 100);
        }

        return $basePrice;
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}
