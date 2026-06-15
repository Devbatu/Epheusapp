<?php

namespace App\Domain\User\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasUuids, HasFactory, HasApiTokens, Notifiable, HasRoles, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'password', 'phone',
        'branch_id', 'is_active',
        'two_factor_enabled', 'two_factor_secret',
        'last_login_at', 'last_login_ip',
        'avatar',
    ];

    protected $hidden = [
        'password', 'remember_token', 'two_factor_secret',
    ];

    protected $casts = [
        'email_verified_at'   => 'datetime',
        'last_login_at'       => 'datetime',
        'is_active'           => 'boolean',
        'two_factor_enabled'  => 'boolean',
        'password'            => 'hashed',
    ];

    public function branch()
    {
        return $this->belongsTo(\App\Domain\Branch\Models\Branch::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getFullNameAttribute(): string
    {
        return $this->name;
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super-admin');
    }

    public function isCompanyAdmin(): bool
    {
        return $this->hasRole('company-admin');
    }

    public function isBranchLevel(): bool
    {
        return $this->hasAnyRole(['branch-manager', 'warehouse-manager', 'sales-representative']);
    }
}
