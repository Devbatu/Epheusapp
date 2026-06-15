<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Domain\User\Models\User;
use App\Domain\Branch\Models\Branch;
use App\Domain\Warehouse\Models\Warehouse;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Roles ────────────────────────────────────────────────────────
        $roles = [
            'super-admin',
            'company-admin',
            'regional-manager',
            'branch-manager',
            'warehouse-manager',
            'sales-representative',
            'customer',
            'dealer',
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'sanctum']);
        }

        // ─── Permissions ──────────────────────────────────────────────────
        $permissions = [
            // Branch
            'branches.view', 'branches.create', 'branches.edit', 'branches.delete',
            // Warehouse
            'warehouses.view', 'warehouses.create', 'warehouses.edit', 'warehouses.delete',
            // Inventory
            'inventory.view', 'inventory.adjust', 'inventory.export',
            // Products
            'products.view', 'products.create', 'products.edit', 'products.delete',
            // Transfers
            'transfers.view', 'transfers.create', 'transfers.approve', 'transfers.ship', 'transfers.receive',
            // Orders
            'orders.view', 'orders.create', 'orders.edit', 'orders.cancel',
            // Purchase
            'purchase.view', 'purchase.create', 'purchase.receive',
            // Finance
            'finance.view', 'finance.create',
            // Users
            'users.view', 'users.create', 'users.edit', 'users.delete',
            // Dealers
            'dealers.view', 'dealers.approve', 'dealers.manage',
            // Reports
            'reports.view', 'reports.export',
            // Analytics
            'analytics.view',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'sanctum']);
        }

        // Assign all permissions to super-admin
        Role::findByName('super-admin', 'sanctum')->givePermissionTo(Permission::all());

        Role::findByName('company-admin', 'sanctum')->givePermissionTo(
            Permission::whereNotIn('name', ['users.delete', 'branches.delete'])->get()
        );

        Role::findByName('branch-manager', 'sanctum')->givePermissionTo([
            'inventory.view', 'inventory.adjust',
            'warehouses.view', 'warehouses.create', 'warehouses.edit',
            'transfers.view', 'transfers.create', 'transfers.approve', 'transfers.ship', 'transfers.receive',
            'orders.view', 'orders.create', 'orders.edit', 'orders.cancel',
            'purchase.view', 'purchase.create', 'purchase.receive',
            'finance.view', 'finance.create',
            'reports.view',
        ]);

        Role::findByName('warehouse-manager', 'sanctum')->givePermissionTo([
            'inventory.view', 'inventory.adjust',
            'warehouses.view',
            'transfers.view', 'transfers.ship', 'transfers.receive',
        ]);

        Role::findByName('sales-representative', 'sanctum')->givePermissionTo([
            'orders.view', 'orders.create',
            'inventory.view',
            'products.view',
        ]);

        // ─── Super Admin User ─────────────────────────────────────────────
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@ephesus.com'],
            [
                'name'      => 'Super Administrator',
                'password'  => Hash::make('Admin@1234!'),
                'is_active' => true,
            ]
        );
        $superAdmin->assignRole('super-admin');

        // ─── Branches ─────────────────────────────────────────────────────
        $branches = [
            ['name' => 'İstanbul Merkez',    'code' => 'BR-001', 'city' => 'Istanbul', 'country' => 'TR', 'slug' => 'istanbul-merkez'],
            ['name' => 'Ankara Şubesi',      'code' => 'BR-002', 'city' => 'Ankara',   'country' => 'TR', 'slug' => 'ankara-subesi'],
            ['name' => 'İzmir Şubesi',       'code' => 'BR-003', 'city' => 'Izmir',    'country' => 'TR', 'slug' => 'izmir-subesi'],
            ['name' => 'Bursa Şubesi',       'code' => 'BR-004', 'city' => 'Bursa',    'country' => 'TR', 'slug' => 'bursa-subesi'],
            ['name' => 'Antalya Şubesi',     'code' => 'BR-005', 'city' => 'Antalya',  'country' => 'TR', 'slug' => 'antalya-subesi'],
        ];

        foreach ($branches as $branchData) {
            $branch = Branch::firstOrCreate(
                ['code' => $branchData['code']],
                array_merge($branchData, ['address' => $branchData['city'] . ' Merkez', 'status' => 'active']),
            );

            // Default warehouse per branch
            Warehouse::firstOrCreate(
                ['branch_id' => $branch->id, 'code' => $branchData['code'] . '-WH01'],
                [
                    'name'       => $branchData['name'] . ' - Ana Depo',
                    'type'       => 'main',
                    'status'     => 'active',
                    'is_default' => true,
                ]
            );
        }

        // Rich demo data (products, stock, customers, dealers, orders, finance)
        $this->call(DemoSeeder::class);

        $this->command->info('✅ Seeding complete. Super Admin: admin@ephesus.com / Admin@1234!');
    }
}
