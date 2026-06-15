<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'name'               => $this->name,
            'email'              => $this->email,
            'phone'              => $this->phone,
            'avatar'             => $this->avatar,
            'branch_id'          => $this->branch_id,
            'branch'             => $this->whenLoaded('branch', fn () => [
                'id'   => $this->branch->id,
                'name' => $this->branch->name,
                'code' => $this->branch->code,
            ]),
            'roles'              => $this->whenLoaded('roles', fn () => $this->roles->map(fn ($r) => [
                'id'   => $r->id,
                'name' => $r->name,
            ])),
            'permissions'        => $this->whenLoaded('permissions', fn () => $this->getAllPermissions()->pluck('name')),
            'two_factor_enabled' => $this->two_factor_enabled,
            'is_active'          => $this->is_active,
            'last_login_at'      => $this->last_login_at?->toIso8601String(),
            'created_at'         => $this->created_at->toIso8601String(),
        ];
    }
}
