<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Domain\Analytics\Services\AnalyticsService;
use App\Domain\Branch\Models\Branch;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function __construct(private readonly AnalyticsService $analytics) {}

    public function overview(): JsonResponse
    {
        return response()->json($this->analytics->getAdminOverview());
    }

    public function revenue(): JsonResponse
    {
        // Last 6 months revenue series
        $series = [];
        for ($m = 5; $m >= 0; $m--) {
            $date  = now()->copy()->subMonths($m);
            $stats = DB::table('orders')
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->whereNotIn('status', ['cancelled', 'returned'])
                ->selectRaw('COALESCE(SUM(total),0) as revenue, COUNT(*) as orders')
                ->first();

            $series[] = [
                'month'   => $date->format('M Y'),
                'revenue' => round((float) $stats->revenue, 2),
                'orders'  => (int) $stats->orders,
            ];
        }

        return response()->json(['data' => $series]);
    }

    public function topProducts(): JsonResponse
    {
        $overview = $this->analytics->getAdminOverview();

        return response()->json(['data' => $overview['top_products']]);
    }

    public function lowStock(): JsonResponse
    {
        $overview = $this->analytics->getAdminOverview();

        return response()->json(['data' => $overview['low_stock_products']]);
    }

    public function branchPerformance(): JsonResponse
    {
        $rows = Branch::query()
            ->where('status', 'active')
            ->withCount(['orders as monthly_orders' => fn ($q) => $q
                ->whereYear('created_at', now()->year)
                ->whereMonth('created_at', now()->month)
                ->whereNotIn('status', ['cancelled', 'returned'])])
            ->withSum(['orders as monthly_revenue' => fn ($q) => $q
                ->whereYear('created_at', now()->year)
                ->whereMonth('created_at', now()->month)
                ->whereNotIn('status', ['cancelled', 'returned'])], 'total')
            ->get(['id', 'name', 'code'])
            ->map(fn ($b) => [
                'id'              => $b->id,
                'name'            => $b->name,
                'code'            => $b->code,
                'monthly_orders'  => (int) $b->monthly_orders,
                'monthly_revenue' => round((float) ($b->monthly_revenue ?? 0), 2),
            ]);

        return response()->json(['data' => $rows]);
    }
}
