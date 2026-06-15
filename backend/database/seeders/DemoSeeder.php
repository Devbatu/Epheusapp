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
use App\Domain\Order\Models\Order;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@ephesus.com')->first();
        $branches = Branch::all();
        $warehouses = Warehouse::all()->keyBy('branch_id');

        // ─── Brands ─────────────────────────────────────────────────────────
        $brands = collect([
            ['name' => 'Ephesus Gold',    'slug' => 'ephesus-gold'],
            ['name' => 'Anatolia',        'slug' => 'anatolia'],
            ['name' => 'Aegean Harvest',  'slug' => 'aegean-harvest'],
            ['name' => 'Mediterra',       'slug' => 'mediterra'],
        ])->map(fn ($b) => Brand::create([
            'name' => $b['name'], 'slug' => $b['slug'], 'is_active' => true,
        ]));

        // ─── Categories ─────────────────────────────────────────────────────
        $catData = [
            'Olive Oil & Vinegar' => 'olive-oil-vinegar',
            'Olives & Pickles'    => 'olives-pickles',
            'Cheese & Dairy'      => 'cheese-dairy',
            'Nuts & Dried Fruit'  => 'nuts-dried-fruit',
            'Sweets & Baklava'    => 'sweets-baklava',
            'Spreads & Sauces'    => 'spreads-sauces',
        ];
        $categories = collect($catData)->map(fn ($slug, $name) => ProductCategory::create([
            'name' => $name, 'slug' => $slug, 'is_active' => true, 'depth' => 0,
        ]));

        // ─── Products (Mediterranean catalogue with demo images) ────────────
        $products = [
            ['Extra Virgin Olive Oil 1L', 'olive-oil-vinegar', 189.90, 110.00, 'EVOO-1L'],
            ['Cold Pressed Olive Oil 500ml', 'olive-oil-vinegar', 119.90, 70.00, 'CPOO-500'],
            ['Pomegranate Vinegar 500ml', 'olive-oil-vinegar', 84.50, 40.00, 'POMV-500'],
            ['Green Olives Stuffed 700g', 'olives-pickles', 99.90, 55.00, 'GROL-700'],
            ['Black Olives Gemlik 1kg', 'olives-pickles', 134.90, 80.00, 'BLOL-1K'],
            ['Mixed Pickles Jar 1kg', 'olives-pickles', 74.90, 38.00, 'MXPK-1K'],
            ['Aged White Cheese 600g', 'cheese-dairy', 159.90, 95.00, 'WCHS-600'],
            ['Kashar Cheese 500g', 'cheese-dairy', 144.90, 88.00, 'KASH-500'],
            ['Strained Yogurt 900g', 'cheese-dairy', 64.90, 32.00, 'STYG-900'],
            ['Premium Medjool Dates 500g', 'nuts-dried-fruit', 174.90, 100.00, 'MEDJ-500'],
            ['Roasted Pistachios 400g', 'nuts-dried-fruit', 224.90, 140.00, 'PIST-400'],
            ['Dried Figs String 500g', 'nuts-dried-fruit', 109.90, 60.00, 'DFIG-500'],
            ['Pistachio Baklava 1kg', 'sweets-baklava', 449.90, 260.00, 'BAKL-1K'],
            ['Turkish Delight Assorted 800g', 'sweets-baklava', 139.90, 75.00, 'TDEL-800'],
            ['Walnut Baklava 500g', 'sweets-baklava', 239.90, 140.00, 'WBAK-500'],
            ['Hummus Classic 500g', 'spreads-sauces', 59.90, 28.00, 'HUMM-500'],
            ['Tahini Pure Sesame 600g', 'spreads-sauces', 94.90, 52.00, 'TAHN-600'],
            ['Pomegranate Molasses 700g', 'spreads-sauces', 69.90, 34.00, 'POMM-700'],
        ];

        $createdProducts = collect();
        $i = 0;
        foreach ($products as [$name, $catSlug, $price, $cost, $sku]) {
            $i++;
            $product = Product::create([
                'brand_id'        => $brands->random()->id,
                'category_id'     => $categories->firstWhere('slug', $catSlug)->id,
                'name'            => $name,
                'slug'            => Str::slug($name),
                'sku'             => $sku,
                'barcode'         => '869' . str_pad((string) $i, 10, '0', STR_PAD_LEFT),
                'short_description' => 'Authentic Mediterranean ' . strtolower($name) . ' — sourced from the Aegean region.',
                'description'     => 'Premium quality ' . $name . '. Hand-selected, naturally produced and packed fresh at Ephesus Mediterranean Delights.',
                'type'            => 'simple',
                'status'          => 'active',
                'is_featured'     => $i % 4 === 0,
                'has_expiration'  => true,
                'base_price'      => $price,
                'cost_price'      => $cost,
                'b2b_price'       => round($price * 0.82, 2),
                'unit'            => 'piece',
                'tax_rate'        => 10.00,
                'min_stock_alert' => 15,
                'min_order_qty'   => 1,
                'origin_country'  => 'TR',
                'meta'            => ['image' => "https://picsum.photos/seed/{$sku}/500/500"],
            ]);
            $createdProducts->push($product);

            // Stock across all branches
            foreach ($branches as $branch) {
                $wh = $warehouses[$branch->id] ?? null;
                if (! $wh) continue;
                $qty = rand(0, 120); // some will be low/zero for the low-stock widget
                Stock::create([
                    'branch_id'    => $branch->id,
                    'warehouse_id' => $wh->id,
                    'product_id'   => $product->id,
                    'quantity'     => $qty,
                    'average_cost' => $cost,
                ]);
            }
        }

        // ─── Suppliers ──────────────────────────────────────────────────────
        $suppliers = [
            ['Aegean Olive Co.', 'aegean-olive'],
            ['Anatolian Dairy Farms', 'anatolian-dairy'],
            ['Gaziantep Nuts & Sweets', 'gaziantep-nuts'],
            ['Marmara Pickles Ltd.', 'marmara-pickles'],
        ];
        foreach ($suppliers as $idx => [$name, $slug]) {
            DB::table('suppliers')->insert([
                'id' => (string) Str::uuid(),
                'name' => $name,
                'code' => 'SUP-' . str_pad((string) ($idx + 1), 3, '0', STR_PAD_LEFT),
                'contact_name' => 'Procurement Office',
                'email' => $slug . '@suppliers.example',
                'phone' => '+90 212 555 0' . rand(100, 999),
                'country' => 'TR', 'city' => 'Izmir',
                'payment_terms_days' => 30, 'currency' => 'TRY',
                'is_active' => true,
                'total_purchased' => rand(50000, 500000),
                'outstanding_balance' => rand(0, 40000),
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        // ─── Customers ──────────────────────────────────────────────────────
        $firstNames = ['Ahmet','Ayşe','Mehmet','Fatma','Mustafa','Zeynep','Ali','Elif','Can','Deniz','Burak','Selin'];
        $lastNames  = ['Yılmaz','Kaya','Demir','Şahin','Çelik','Yıldız','Arslan','Doğan','Kılıç','Aydın'];
        $customers = collect();
        for ($c = 0; $c < 14; $c++) {
            $fn = $firstNames[$c % count($firstNames)];
            $ln = $lastNames[$c % count($lastNames)];
            $email = strtolower(Str::ascii($fn) . '.' . Str::ascii($ln) . $c . '@customer.example');

            $user = User::create([
                'name' => "$fn $ln", 'email' => $email,
                'password' => Hash::make('password'), 'is_active' => true,
            ]);
            $user->assignRole('customer');

            $cust = DB::table('customers')->insertGetId([
                'id' => $cid = (string) Str::uuid(),
                'user_id' => $user->id,
                'first_name' => $fn, 'last_name' => $ln,
                'email' => $email, 'phone' => '+90 5' . rand(30, 59) . rand(1000000, 9999999),
                'is_active' => true, 'email_verified' => true,
                'total_spent' => 0, 'total_orders' => 0,
                'created_at' => now()->subDays(rand(1, 120)), 'updated_at' => now(),
            ]);
            $customers->push($cid);
        }

        // ─── Dealers ────────────────────────────────────────────────────────
        $companies = [
            ['Marmara Gıda A.Ş.', 'approved'],
            ['Ege Toptan Market', 'approved'],
            ['Akdeniz Distribütör', 'approved'],
            ['Başkent Şarküteri', 'pending'],
            ['Karadeniz Ticaret', 'pending'],
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
                'contact_name' => 'Satın Alma Müdürü',
                'email' => $email, 'phone' => '+90 216 555 0' . rand(100, 999),
                'address' => 'Organize Sanayi Bölgesi No:' . rand(1, 99),
                'country' => 'TR', 'city' => 'Istanbul',
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

        // ─── Orders (customer + dealer, varied statuses, last 60 days) ──────
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

            $lineCount = rand(1, 5);
            $items = $createdProducts->random($lineCount);
            $subtotal = 0; $taxTotal = 0;
            $orderItems = [];
            foreach ($items as $p) {
                $qty = rand(1, 8);
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
                'total' => round($total, 2), 'currency' => 'TRY',
                'payment_method' => $isDealer ? 'credit' : 'card',
                'payment_status' => in_array($status, ['delivered','shipped']) ? 'paid' : 'pending',
                'created_at' => $createdAt, 'updated_at' => $createdAt,
            ]);
            DB::table('order_items')->insert(array_map(fn ($it) => $it + ['order_id' => $orderId], $orderItems));

            // Finance income for paid orders
            if (in_array($status, ['delivered','shipped'])) {
                DB::table('finance_transactions')->insert([
                    'id' => (string) Str::uuid(),
                    'branch_id' => $branch->id, 'type' => 'income', 'category' => 'sales',
                    'amount' => round($total, 2), 'currency' => 'TRY',
                    'description' => 'Sale income', 'created_by' => $admin->id,
                    'transaction_date' => $createdAt->toDateString(),
                    'created_at' => $createdAt, 'updated_at' => $createdAt,
                ]);
            }
        }

        // ─── Some expenses ──────────────────────────────────────────────────
        foreach ($branches as $branch) {
            foreach (['rent' => 25000, 'salary' => 60000, 'utilities' => 8000] as $cat => $amt) {
                DB::table('finance_transactions')->insert([
                    'id' => (string) Str::uuid(),
                    'branch_id' => $branch->id, 'type' => 'expense', 'category' => $cat,
                    'amount' => $amt + rand(-2000, 2000), 'currency' => 'TRY',
                    'description' => ucfirst($cat) . ' expense', 'created_by' => $admin->id,
                    'transaction_date' => now()->startOfMonth()->toDateString(),
                    'created_at' => now(), 'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('✅ Demo data seeded: ' . $createdProducts->count() . ' products, 60 orders, dealers, customers, finance.');
    }
}
