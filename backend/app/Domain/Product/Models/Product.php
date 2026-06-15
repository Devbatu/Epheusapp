<?php

namespace App\Domain\Product\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Product extends Model implements HasMedia
{
    use HasUuids, HasFactory, SoftDeletes, Searchable, InteractsWithMedia;

    protected $fillable = [
        'brand_id', 'category_id', 'name', 'slug', 'sku', 'barcode',
        'description', 'short_description', 'type', 'status',
        'is_featured', 'requires_batch_tracking', 'requires_lot_tracking',
        'has_expiration', 'expiration_alert_days',
        'base_price', 'cost_price', 'b2b_price',
        'unit', 'weight', 'dimensions', 'origin_country',
        'min_order_qty', 'min_stock_alert', 'tax_rate', 'meta', 'sort_order',
    ];

    protected $casts = [
        'is_featured'             => 'boolean',
        'requires_batch_tracking' => 'boolean',
        'requires_lot_tracking'   => 'boolean',
        'has_expiration'          => 'boolean',
        'base_price'              => 'decimal:2',
        'cost_price'              => 'decimal:2',
        'b2b_price'               => 'decimal:2',
        'weight'                  => 'decimal:3',
        'dimensions'              => 'array',
        'meta'                    => 'array',
        'sort_order'              => 'integer',
        'min_order_qty'           => 'integer',
        'min_stock_alert'         => 'integer',
        'expiration_alert_days'   => 'integer',
        'tax_rate'                => 'decimal:2',
    ];

    // ─── Scout ─────────────────────────────────────────────────────────────

    public function toSearchableArray(): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'sku'         => $this->sku,
            'barcode'     => $this->barcode,
            'description' => $this->description,
            'category'    => $this->category?->name,
            'brand'       => $this->brand?->name,
            'status'      => $this->status,
        ];
    }

    // ─── Media Collections ─────────────────────────────────────────────────

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp'])
            ->withResponsiveImages();

        $this->addMediaCollection('videos')
            ->acceptsMimeTypes(['video/mp4', 'video/webm'])
            ->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)->height(300)->nonQueued();

        $this->addMediaConversion('medium')
            ->width(800)->height(800);
    }

    // ─── Relationships ──────────────────────────────────────────────────────

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function attributeValues(): HasMany
    {
        return $this->hasMany(ProductAttributeValue::class);
    }

    // ─── Scopes ────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeExpiringSoon($query, int $days = 30)
    {
        return $query->where('has_expiration', true)
            ->whereHas('batches', fn ($q) => $q->where('expiration_date', '<=', now()->addDays($days)));
    }
}
