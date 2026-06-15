<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Domain\Inventory\Models\Stock;
use App\Domain\Inventory\Models\Batch;
use App\Notifications\LowStockAlertNotification;
use App\Notifications\ExpiringBatchNotification;
use App\Domain\User\Models\User;
use Illuminate\Support\Facades\Notification;

class StockAlertCommand extends Command
{
    protected $signature   = 'ephesus:stock-alerts';
    protected $description = 'Send low stock and expiration alerts to branch managers.';

    public function handle(): void
    {
        $this->handleLowStock();
        $this->handleExpiringBatches();
    }

    private function handleLowStock(): void
    {
        $lowStockItems = Stock::with(['product', 'warehouse.branch'])
            ->lowStock()
            ->where('quantity', '>', 0)
            ->get();

        if ($lowStockItems->isEmpty()) {
            $this->info('No low-stock items found.');
            return;
        }

        // Group by branch
        $byBranch = $lowStockItems->groupBy('branch_id');

        foreach ($byBranch as $branchId => $items) {
            $managers = User::whereHas('roles', fn ($q) => $q->whereIn('name', ['branch-manager', 'warehouse-manager']))
                ->where('branch_id', $branchId)
                ->get();

            foreach ($managers as $manager) {
                $manager->notify(new LowStockAlertNotification($items));
            }
        }

        $this->info("Low stock alerts sent for {$byBranch->count()} branches.");
    }

    private function handleExpiringBatches(): void
    {
        $expiringBatches = Batch::with(['product', 'stocks.warehouse.branch'])
            ->where('status', 'active')
            ->whereNotNull('expiration_date')
            ->whereRaw('expiration_date <= NOW() + (products.expiration_alert_days || \' days\')::interval')
            ->join('products', 'products.id', '=', 'batches.product_id')
            ->where('batches.remaining_quantity', '>', 0)
            ->select('batches.*')
            ->get();

        if ($expiringBatches->isEmpty()) {
            $this->info('No expiring batches found.');
            return;
        }

        $this->info("Expiration alerts queued for {$expiringBatches->count()} batches.");
    }
}
