<?php

namespace App\Domain\Analytics\Services;

use App\Domain\Order\Models\Order;
use App\Domain\Inventory\Models\Stock;
use App\Domain\Transfer\Models\TransferRequest;
use App\Domain\Dealer\Models\Dealer;
use App\Domain\Branch\Models\Branch;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    public function getAdminOverview(): array
    {
        return Cache::remember('analytics:admin_overview', 300, function () {
            return [
                'today_sales'         => $this->todaySales(),
                'monthly_revenue'     => $this->monthlyRevenue(),
                'top_products'        => $this->topProducts(),
                'low_stock_products'  => $this->lowStockProducts(),
                'pending_transfers'   => $this->pendingTransfers(),
                'dealer_revenue'      => $this->dealerRevenue(),
                'branch_performance'  => $this->branchPerformance(),
            ];
        });
    }

    public function getBranchOverview(string $branchId): array
    {
        return Cache::remember("analytics:branch_{$branchId}", 180, function () use ($branchId) {
            return [
                'today_sales'        => $this->todaySales($branchId),
                'monthly_revenue'    => $this->monthlyRevenue($branchId),
                'low_stock_products' => $this->lowStockProducts($branchId),
                'pending_transfers'  => $this->pendingTransfers($branchId),
                'top_products'       => $this->topProducts($branchId),
                'order_breakdown'    => $this->orderBreakdown($branchId),
            ];
        });
    }

    private function todaySales(?string $branchId = null): array
    {
        $query = Order::whereDate('created_at', today())
            ->whereNotIn('status', ['cancelled', 'returned']);

        if ($branchId) {
            $query->where('branch_id', $branchId);
        }

        return [
            'count'  => $query->count(),
            'amount' => $query->sum('total'),
        ];
    }

    private function monthlyRevenue(?string $branchId = null): array
    {
        $query = Order::whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->whereNotIn('status', ['cancelled', 'returned']);

        if ($branchId) {
            $query->where('branch_id', $branchId);
        }

        return [
            'total'      => $query->sum('total'),
            'orders'     => $query->count(),
            'avg_order'  => $query->avg('total') ?? 0,
        ];
    }

    private function topProducts(?string $branchId = null, int $limit = 10): array
    {
        return DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->when($branchId, fn ($q) => $q->where('orders.branch_id', $branchId))
            ->whereNotIn('orders.status', ['cancelled', 'returned'])
            ->whereMonth('orders.created_at', now()->month)
            ->groupBy('order_items.product_id', 'products.name')
            ->orderByDesc('total_qty')
            ->limit($limit)
            ->select(
                'order_items.product_id',
                'products.name',
                DB::raw('SUM(order_items.quantity) as total_qty'),
                DB::raw('SUM(order_items.subtotal) as total_revenue'),
            )
            ->get()
            ->toArray();
    }

    private function lowStockProducts(?string $branchId = null, int $limit = 20): array
    {
        return DB::table('stocks')
            ->join('products', 'products.id', '=', 'stocks.product_id')
            ->when($branchId, fn ($q) => $q->where('stocks.branch_id', $branchId))
            ->whereRaw('stocks.quantity <= products.min_stock_alert')
            ->where('products.status', 'active')
            ->orderBy('stocks.quantity')
            ->limit($limit)
            ->select(
                'stocks.product_id',
                'products.name',
                'products.sku',
                'products.min_stock_alert',
                'stocks.quantity',
                'stocks.branch_id',
                'stocks.warehouse_id',
            )
            ->get()
            ->toArray();
    }

    private function pendingTransfers(?string $branchId = null): int
    {
        $query = TransferRequest::where('status', 'pending');

        if ($branchId) {
            $query->where(
                fn ($q) => $q->where('from_branch_id', $branchId)->orWhere('to_branch_id', $branchId)
            );
        }

        return $query->count();
    }

    private function dealerRevenue(): array
    {
        return DB::table('orders')
            ->where('channel', 'dealer')
            ->whereMonth('created_at', now()->month)
            ->whereNotIn('status', ['cancelled', 'returned'])
            ->select(
                DB::raw('COUNT(*) as orders'),
                DB::raw('SUM(total) as revenue'),
            )
            ->first() ? (array) DB::table('orders')
                ->where('channel', 'dealer')
                ->whereMonth('created_at', now()->month)
                ->whereNotIn('status', ['cancelled', 'returned'])
                ->select(DB::raw('COUNT(*) as orders'), DB::raw('SUM(total) as revenue'))
                ->first() : ['orders' => 0, 'revenue' => 0];
    }

    private function branchPerformance(): array
    {
        return Branch::active()
            ->withCount(['orders as monthly_orders' => fn ($q) => $q->whereMonth('created_at', now()->month)])
            ->withSum(['orders as monthly_revenue' => fn ($q) => $q->whereMonth('created_at', now()->month)], 'total')
            ->get(['id', 'name', 'code'])
            ->toArray();
    }

    private function orderBreakdown(string $branchId): array
    {
        return Order::where('branch_id', $branchId)
            ->whereMonth('created_at', now()->month)
            ->groupBy('status')
            ->select('status', DB::raw('count(*) as count'))
            ->pluck('count', 'status')
            ->toArray();
    }
}
