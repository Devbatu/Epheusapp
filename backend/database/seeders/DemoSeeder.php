<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Domain\User\Models\User;
use App\Domain\Branch\Models\Branch;
use App\Domain\Warehouse\Models\Warehouse;
use App\Domain\Product\Models\Product;
use App\Domain\Product\Models\Brand;
use App\Domain\Product\Models\ProductCategory;
use App\Domain\Inventory\Models\Stock;
use App\Domain\Dealer\Models\Dealer;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@ephesus.com')->first();
        $branches = Branch::all();
        $warehouses = Warehouse::all()->keyBy('branch_id');

        $u = fn (string $id) => "https://images.unsplash.com/photo-{$id}?auto=format&fit=crop&w=800&q=80";

        // ─── Brands ─────────────────────────────────────────────────────────
        $brands = collect([
            ['name' => 'Ephesus Gold',  'slug' => 'ephesus-gold'],
            ['name' => 'Anatolia',      'slug' => 'anatolia'],
            ['name' => 'Bosphorus',     'slug' => 'bosphorus'],
            ['name' => "Sultan's",      'slug' => 'sultans'],
        ])->map(fn ($b) => Brand::create([
            'name' => $b['name'], 'slug' => $b['slug'], 'is_active' => true,
        ]));

        // ─── Categories (match reference nav) ───────────────────────────────
        $catData = [
            'Baklava'           => 'baklava',
            'Turkish Delight'   => 'turkish-delight',
            'Turkish Coffee'    => 'turkish-coffee',
            'Gift Boxes'        => 'gift-boxes',
            'Chocolate & Nuts'  => 'chocolate-nuts',
            'Honey & Preserves' => 'honey-preserves',
        ];
        $categories = collect($catData)->map(fn ($slug, $name) => ProductCategory::create([
            'name' => $name, 'slug' => $slug, 'is_active' => true, 'depth' => 0,
        ]));

        // ─── Product catalogue (English · USD · Turkish delights) ───────────
        // [name, category, price, cost, sku, image-id, featured]
        $products = [
            ['Pistachio Baklava',          'baklava', 54.99, 28.00, 'BKL-PST', '1519676867240-f03562e64548', true],
            ['Mixed Baklava Box',          'baklava', 64.99, 33.00, 'BKL-MIX', '1571877227200-a0d98ea607e9', true],
            ['Walnut Baklava',             'baklava', 44.99, 22.00, 'BKL-WAL', '1519676867240-f03562e64548', false],
            ['Chocolate Baklava',          'baklava', 49.99, 25.00, 'BKL-CHO', '1571877227200-a0d98ea607e9', false],
            ['Assorted Turkish Delight',   'turkish-delight', 29.99, 14.00, 'TD-AST', '1606471191009-63994c53433b', true],
            ['Pomegranate Turkish Delight','turkish-delight', 32.99, 16.00, 'TD-POM', '1606471191009-63994c53433b', false],
            ['Rose & Pistachio Lokum',     'turkish-delight', 34.99, 17.00, 'TD-ROS', '1578985545062-69928b1d9587', false],
            ['Double Roasted Pistachio Lokum','turkish-delight', 39.99, 20.00, 'TD-DBL', '1578985545062-69928b1d9587', false],
            ['Turkish Coffee Set',         'turkish-coffee', 89.99, 48.00, 'TC-SET', '1495474472287-4d71bcdd2085', true],
            ['Traditional Ground Coffee',  'turkish-coffee', 19.99, 9.00, 'TC-GRD', '1481391319762-47dff72954d9', false],
            ['Copper Cezve & Cups',        'turkish-coffee', 74.99, 40.00, 'TC-CZV', '1495474472287-4d71bcdd2085', false],
            ['Luxury Gift Box — Grand',    'gift-boxes', 129.99, 70.00, 'GB-GRD', '1565958011703-44f9829ba187', true],
            ['Signature Wooden Gift Box',  'gift-boxes', 99.99, 55.00, 'GB-WDN', '1517433367423-c7e5b0f35086', false],
            ['Celebration Gift Box',       'gift-boxes', 79.99, 42.00, 'GB-CEL', '1549007994-cb92caebd54b', false],
            ['Roasted Pistachios 400g',    'chocolate-nuts', 24.99, 12.00, 'CN-PST', '1599599810769-bcde5a160d32', false],
            ['Chocolate Coated Dates',     'chocolate-nuts', 27.99, 13.00, 'CN-DAT', '1565958011703-44f9829ba187', true],
            ['Anatolian Blossom Honey 850g','honey-preserves', 22.99, 10.00, 'HP-HNY', '1601493700631-2b16ec4b4716', false],
            ['Rose Petal Jam 380g',        'honey-preserves', 14.99, 6.00, 'HP-ROS', '1601493700631-2b16ec4b4716', false],
        ];

        // Shared imagery pool for building per-product galleries
        $pool = [
            '1519676867240-f03562e64548', '1571877227200-a0d98ea607e9', '1606471191009-63994c53433b',
            '1565958011703-44f9829ba187', '1495474472287-4d71bcdd2085', '1599599810769-bcde5a160d32',
            '1601493700631-2b16ec4b4716', '1505253716362-afaea1d3d1af',
        ];

        $createdProducts = collect();
        $i = 0;
        foreach ($products as [$name, $catSlug, $price, $cost, $sku, $imgId, $featured]) {
            $i++;
            // Build a 4-image gallery: primary + 3 distinct from the pool
            $gallery = [$imgId];
            foreach ([$i, $i + 2, $i + 4] as $off) {
                $cand = $pool[$off % count($pool)];
                if (! in_array($cand, $gallery)) $gallery[] = $cand;
            }
            $images = array_map(fn ($id) => $u($id), $gallery);
            $product = Product::create([
                'brand_id'        => $brands->random()->id,
                'category_id'     => $categories->firstWhere('slug', $catSlug)->id,
                'name'            => $name,
                'slug'            => Str::slug($name),
                'sku'             => $sku,
                'barcode'         => '869' . str_pad((string) $i, 10, '0', STR_PAD_LEFT),
                'short_description' => 'Handcrafted in tradition, delivered fresh — authentic ' . strtolower($name) . '.',
                'description'     => 'Our ' . $name . ' is prepared by skilled artisans following centuries-old recipes, '
                    . 'using only the finest nuts, honey and natural ingredients. Beautifully packaged and shipped fresh from Anatolia.',
                'type'            => 'simple',
                'status'          => 'active',
                'is_featured'     => $featured,
                'has_expiration'  => true,
                'base_price'      => $price,
                'cost_price'      => $cost,
                'b2b_price'       => round($price * 0.82, 2),
                'unit'            => 'box',
                'tax_rate'        => 8.00,
                'min_stock_alert' => 15,
                'min_order_qty'   => 1,
                'origin_country'  => 'TR',
                'meta'            => ['image' => $u($imgId), 'images' => $images],
            ]);
            $createdProducts->push($product);

            foreach ($branches as $branch) {
                $wh = $warehouses[$branch->id] ?? null;
                if (! $wh) continue;
                Stock::create([
                    'branch_id'    => $branch->id,
                    'warehouse_id' => $wh->id,
                    'product_id'   => $product->id,
                    'quantity'     => rand(0, 140),
                    'average_cost' => $cost,
                ]);
            }
        }

        // ─── Suppliers ──────────────────────────────────────────────────────
        $suppliers = [
            ['Gaziantep Baklava Co.', 'gaziantep-baklava'],
            ['Anatolian Honey Farms', 'anatolian-honey'],
            ['Istanbul Confectionery', 'istanbul-confectionery'],
            ['Aegean Nuts Ltd.', 'aegean-nuts'],
        ];
        foreach ($suppliers as $idx => [$name, $slug]) {
            DB::table('suppliers')->insert([
                'id' => (string) Str::uuid(),
                'name' => $name,
                'code' => 'SUP-' . str_pad((string) ($idx + 1), 3, '0', STR_PAD_LEFT),
                'contact_name' => 'Procurement Office',
                'email' => $slug . '@suppliers.example',
                'phone' => '+90 342 555 0' . rand(100, 999),
                'country' => 'TR', 'city' => 'Gaziantep',
                'payment_terms_days' => 30, 'currency' => 'USD',
                'is_active' => true,
                'total_purchased' => rand(50000, 500000),
                'outstanding_balance' => rand(0, 40000),
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        // ─── Customers ──────────────────────────────────────────────────────
        $firstNames = ['James','Emily','Michael','Sophia','David','Olivia','Daniel','Emma','William','Ava','John','Mia'];
        $lastNames  = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Taylor'];
        $customers = collect();
        for ($c = 0; $c < 14; $c++) {
            $fn = $firstNames[$c % count($firstNames)];
            $ln = $lastNames[$c % count($lastNames)];
            $email = strtolower($fn . '.' . $ln . $c . '@customer.example');

            $user = User::create([
                'name' => "$fn $ln", 'email' => $email,
                'password' => Hash::make('password'), 'is_active' => true,
            ]);
            $user->assignRole('customer');

            DB::table('customers')->insert([
                'id' => $cid = (string) Str::uuid(),
                'user_id' => $user->id,
                'first_name' => $fn, 'last_name' => $ln,
                'email' => $email, 'phone' => '+1 555 ' . rand(1000000, 9999999),
                'is_active' => true, 'email_verified' => true,
                'total_spent' => 0, 'total_orders' => 0,
                'created_at' => now()->subDays(rand(1, 120)), 'updated_at' => now(),
            ]);
            $customers->push($cid);
        }

        // ─── Dealers ────────────────────────────────────────────────────────
        $companies = [
            ['Mediterranean Imports LLC', 'approved'],
            ['Gourmet Distributors Inc.', 'approved'],
            ['Levant Foods Trading', 'approved'],
            ['Bazaar Wholesale Co.', 'pending'],
            ['Silk Road Provisions', 'pending'],
        ];
        $dealers = collect();
        foreach ($companies as $idx => [$company, $status]) {
            $email = 'dealer' . ($idx + 1) . '@dealer.example';
            $user = User::create([
                'name' => $company, 'email' => $email,
                'password' => Hash::make('password'), 'is_active' => true,
            ]);
            $user->assignRole('dealer');

            $dealer = Dealer::create([
                'user_id' => $user->id,
                'company_name' => $company,
                'company_slug' => Str::slug($company) . '-' . $idx,
                'tax_number' => (string) rand(1000000000, 9999999999),
                'contact_name' => 'Purchasing Manager',
                'email' => $email, 'phone' => '+1 212 555 0' . rand(100, 999),
                'address' => 'Suite ' . rand(100, 999) . ', Trade Center',
                'country' => 'US', 'city' => 'New York',
                'status' => $status,
                'credit_limit' => $status === 'approved' ? rand(50000, 200000) : 0,
                'current_balance' => $status === 'approved' ? rand(0, 40000) : 0,
                'discount_rate' => $status === 'approved' ? [10, 12, 15][rand(0, 2)] : 0,
                'payment_terms_days' => 30,
                'approved_by' => $status === 'approved' ? $admin->id : null,
                'approved_at' => $status === 'approved' ? now()->subDays(rand(10, 90)) : null,
            ]);
            if ($status === 'approved') $dealers->push($dealer);
        }

        // ─── Orders ─────────────────────────────────────────────────────────
        $statuses = ['delivered','delivered','delivered','shipped','processing','confirmed','pending','cancelled'];
        $orderNo = 1;
        for ($o = 0; $o < 60; $o++) {
            $branch = $branches->random();
            $wh = $warehouses[$branch->id] ?? null;
            if (! $wh) continue;

            $isDealer = rand(0, 100) < 35 && $dealers->isNotEmpty();
            $dealer = $isDealer ? $dealers->random() : null;
            $status = $statuses[array_rand($statuses)];
            $createdAt = now()->subDays(rand(0, 60))->subHours(rand(0, 23));

            $items = $createdProducts->random(rand(1, 5));
            $subtotal = 0; $taxTotal = 0; $orderItems = [];
            foreach ($items as $p) {
                $qty = rand(1, 6);
                $unit = $isDealer ? (float) $p->b2b_price : (float) $p->base_price;
                $lineSub = $unit * $qty;
                $tax = $lineSub * ($p->tax_rate / 100);
                $subtotal += $lineSub; $taxTotal += $tax;
                $orderItems[] = [
                    'id' => (string) Str::uuid(),
                    'product_id' => $p->id, 'product_name' => $p->name, 'sku' => $p->sku,
                    'quantity' => $qty, 'unit_price' => $unit, 'cost_price' => $p->cost_price,
                    'discount_amount' => 0, 'tax_rate' => $p->tax_rate, 'tax_amount' => round($tax, 2),
                    'subtotal' => round($lineSub, 2), 'status' => 'confirmed',
                    'created_at' => $createdAt, 'updated_at' => $createdAt,
                ];
            }
            $total = $subtotal + $taxTotal;
            $orderId = (string) Str::uuid();
            DB::table('orders')->insert([
                'id' => $orderId,
                'order_number' => 'ORD-2026-' . str_pad((string) $orderNo++, 6, '0', STR_PAD_LEFT),
                'channel' => $isDealer ? 'dealer' : 'customer',
                'branch_id' => $branch->id, 'warehouse_id' => $wh->id,
                'customer_id' => $isDealer ? null : $customers->random(),
                'dealer_id' => $dealer?->id,
                'placed_by' => $admin->id,
                'status' => $status,
                'subtotal' => round($subtotal, 2), 'discount_amount' => 0, 'discount_rate' => 0,
                'tax_amount' => round($taxTotal, 2), 'shipping_amount' => 0,
                'total' => round($total, 2), 'currency' => 'USD',
                'payment_method' => $isDealer ? 'credit' : 'card',
                'payment_status' => in_array($status, ['delivered','shipped']) ? 'paid' : 'pending',
                'created_at' => $createdAt, 'updated_at' => $createdAt,
            ]);
            DB::table('order_items')->insert(array_map(fn ($it) => $it + ['order_id' => $orderId], $orderItems));

            if (in_array($status, ['delivered','shipped'])) {
                DB::table('finance_transactions')->insert([
                    'id' => (string) Str::uuid(),
                    'branch_id' => $branch->id, 'type' => 'income', 'category' => 'sales',
                    'amount' => round($total, 2), 'currency' => 'USD',
                    'description' => 'Sale income', 'created_by' => $admin->id,
                    'transaction_date' => $createdAt->toDateString(),
                    'created_at' => $createdAt, 'updated_at' => $createdAt,
                ]);
            }
        }

        // ─── Expenses ───────────────────────────────────────────────────────
        foreach ($branches as $branch) {
            foreach (['rent' => 6000, 'salary' => 18000, 'utilities' => 2200] as $cat => $amt) {
                DB::table('finance_transactions')->insert([
                    'id' => (string) Str::uuid(),
                    'branch_id' => $branch->id, 'type' => 'expense', 'category' => $cat,
                    'amount' => $amt + rand(-500, 500), 'currency' => 'USD',
                    'description' => ucfirst($cat) . ' expense', 'created_by' => $admin->id,
                    'transaction_date' => now()->startOfMonth()->toDateString(),
                    'created_at' => now(), 'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('✅ Demo data seeded: ' . $createdProducts->count() . ' products (Turkish delights), 60 orders.');
    }
}
