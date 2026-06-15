<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Model;
use App\Domain\Branch\Repositories\BranchRepositoryInterface;
use App\Domain\Branch\Repositories\BranchRepository;
use App\Domain\Warehouse\Repositories\WarehouseRepositoryInterface;
use App\Domain\Warehouse\Repositories\WarehouseRepository;
use App\Domain\Inventory\Repositories\StockRepositoryInterface;
use App\Domain\Inventory\Repositories\StockRepository;
use App\Domain\Product\Repositories\ProductRepositoryInterface;
use App\Domain\Product\Repositories\ProductRepository;
use App\Domain\Order\Repositories\OrderRepositoryInterface;
use App\Domain\Order\Repositories\OrderRepository;
use App\Domain\Transfer\Repositories\TransferRepositoryInterface;
use App\Domain\Transfer\Repositories\TransferRepository;
use App\Domain\Dealer\Repositories\DealerRepositoryInterface;
use App\Domain\Dealer\Repositories\DealerRepository;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Repository bindings
        $this->app->bind(BranchRepositoryInterface::class, BranchRepository::class);
        $this->app->bind(WarehouseRepositoryInterface::class, WarehouseRepository::class);
        $this->app->bind(StockRepositoryInterface::class, StockRepository::class);
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
        $this->app->bind(OrderRepositoryInterface::class, OrderRepository::class);
        $this->app->bind(TransferRepositoryInterface::class, TransferRepository::class);
        $this->app->bind(DealerRepositoryInterface::class, DealerRepository::class);
    }

    public function boot(): void
    {
        Model::shouldBeStrict(! app()->isProduction());

        if (app()->isProduction()) {
            DB::listen(function ($query) {
                if ($query->time > 1000) {
                    Log::warning('Slow query detected', [
                        'sql'  => $query->sql,
                        'time' => $query->time . 'ms',
                    ]);
                }
            });
        }
    }
}
