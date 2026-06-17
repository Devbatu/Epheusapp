<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function sales(): JsonResponse
    {
        $byChannel = DB::table('orders')
            ->whereNotIn('status', ['cancelled', 'returned'])
            ->groupBy('channel')
            ->select('channel', DB::raw('COUNT(*) as orders'), DB::raw('COALESCE(SUM(total),0) as revenue'))
            ->get();

        $byStatus = DB::table('orders')
            ->groupBy('status')
            ->select('status', DB::raw('COUNT(*) as count'))
            ->get();

        return response()->json([
            'data' => [
                'total_revenue' => (float) DB::table('orders')->whereNotIn('status', ['cancelled', 'returned'])->sum('total'),
                'total_orders'  => DB::table('orders')->count(),
                'by_channel'    => $byChannel,
                'by_status'     => $byStatus,
            ],
        ]);
    }

    public function stock(): JsonResponse
    {
        $rows = DB::table('stocks')
            ->join('products', 'products.id', '=', 'stocks.product_id')
            ->join('branches', 'branches.id', '=', 'stocks.branch_id')
            ->select('products.name', 'products.sku', 'branches.name as branch',
                'stocks.quantity', 'products.min_stock_alert')
            ->orderBy('stocks.quantity')
            ->limit(100)
            ->get();

        return response()->json(['data' => $rows]);
    }

    public function profitability(): JsonResponse
    {
        $rows = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->whereNotIn('orders.status', ['cancelled', 'returned'])
            ->groupBy('order_items.product_name')
            ->select('order_items.product_name as name',
                DB::raw('SUM(order_items.quantity) as units'),
                DB::raw('SUM(order_items.subtotal) as revenue'),
                DB::raw('SUM(order_items.quantity * COALESCE(order_items.cost_price,0)) as cost'))
            ->orderByDesc('revenue')
            ->limit(20)
            ->get()
            ->map(fn ($r) => [
                'name'    => $r->name,
                'units'   => (int) $r->units,
                'revenue' => (float) $r->revenue,
                'profit'  => (float) $r->revenue - (float) $r->cost,
            ]);

        return response()->json(['data' => $rows]);
    }

    public function branchPerformance(): JsonResponse
    {
        $rows = DB::table('orders')
            ->join('branches', 'branches.id', '=', 'orders.branch_id')
            ->whereNotIn('orders.status', ['cancelled', 'returned'])
            ->groupBy('branches.name')
            ->select('branches.name', DB::raw('COUNT(*) as orders'), DB::raw('COALESCE(SUM(orders.total),0) as revenue'))
            ->orderByDesc('revenue')
            ->get();

        return response()->json(['data' => $rows]);
    }

    public function transfers(): JsonResponse
    {
        $rows = DB::table('transfer_requests')
            ->groupBy('status')
            ->select('status', DB::raw('COUNT(*) as count'))
            ->get();

        return response()->json(['data' => $rows]);
    }

    public function dealerSales(): JsonResponse
    {
        $rows = DB::table('orders')
            ->join('dealers', 'dealers.id', '=', 'orders.dealer_id')
            ->where('orders.channel', 'dealer')
            ->whereNotIn('orders.status', ['cancelled', 'returned'])
            ->groupBy('dealers.company_name')
            ->select('dealers.company_name as name', DB::raw('COUNT(*) as orders'), DB::raw('COALESCE(SUM(orders.total),0) as revenue'))
            ->orderByDesc('revenue')
            ->get();

        return response()->json(['data' => $rows]);
    }

    public function export(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Export will be available soon.'], 200);
    }
}
