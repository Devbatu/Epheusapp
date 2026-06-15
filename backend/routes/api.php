<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\TwoFactorController;
use App\Http\Controllers\Api\Admin\BranchController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\RoleController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Api\Admin\ReportController;
use App\Http\Controllers\Api\Admin\AnalyticsController;
use App\Http\Controllers\Api\Branch\BranchDashboardController;
use App\Http\Controllers\Api\Branch\InventoryController;
use App\Http\Controllers\Api\Branch\WarehouseController;
use App\Http\Controllers\Api\Branch\StockMovementController;
use App\Http\Controllers\Api\Branch\TransferController;
use App\Http\Controllers\Api\Branch\OrderController as BranchOrderController;
use App\Http\Controllers\Api\Branch\PurchaseController;
use App\Http\Controllers\Api\Branch\FinanceController;
use App\Http\Controllers\Api\Dealer\DealerAuthController;
use App\Http\Controllers\Api\Dealer\DealerOrderController;
use App\Http\Controllers\Api\Dealer\DealerProductController;
use App\Http\Controllers\Api\Dealer\DealerProfileController;
use App\Http\Controllers\Api\Customer\CustomerAuthController;
use App\Http\Controllers\Api\Customer\CustomerOrderController;
use App\Http\Controllers\Api\Customer\CustomerProductController;
use App\Http\Controllers\Api\Customer\CartController;
use App\Http\Controllers\Api\Customer\WishlistController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\SupplierController;
use App\Http\Controllers\Api\Admin\DealerManagementController;
use App\Http\Controllers\Api\Admin\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes — Ephesus Mediterranean Delights
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ─── Public Health Check ──────────────────────────────────────────────
    Route::get('/health', fn () => response()->json(['status' => 'ok', 'version' => '1.0.0']));

    // ─── Auth ─────────────────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
        Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

        // Two-Factor
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/2fa/enable', [TwoFactorController::class, 'enable']);
            Route::post('/2fa/confirm', [TwoFactorController::class, 'confirm']);
            Route::post('/2fa/disable', [TwoFactorController::class, 'disable']);
            Route::post('/2fa/verify', [TwoFactorController::class, 'verify']);
        });

        Route::post('/password/forgot', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');
        Route::post('/password/reset', [AuthController::class, 'resetPassword']);
    });

    // ─── Public E-Commerce ────────────────────────────────────────────────
    Route::prefix('shop')->group(function () {
        Route::get('/products', [CustomerProductController::class, 'index']);
        Route::get('/products/{slug}', [CustomerProductController::class, 'show']);
        Route::get('/categories', [CategoryController::class, 'publicIndex']);
        Route::get('/categories/{slug}/products', [CategoryController::class, 'products']);
    });

    // ─── Customer Auth & Portal ───────────────────────────────────────────
    Route::prefix('customer')->group(function () {
        Route::post('/register', [CustomerAuthController::class, 'register'])->middleware('throttle:5,1');
        Route::post('/login', [CustomerAuthController::class, 'login'])->middleware('throttle:10,1');

        Route::middleware(['auth:sanctum', 'role:customer'])->group(function () {
            Route::get('/profile', [CustomerAuthController::class, 'profile']);
            Route::put('/profile', [CustomerAuthController::class, 'updateProfile']);

            Route::apiResource('/orders', CustomerOrderController::class)->only(['index', 'show', 'store']);
            Route::post('/orders/{order}/cancel', [CustomerOrderController::class, 'cancel']);

            Route::get('/cart', [CartController::class, 'index']);
            Route::post('/cart', [CartController::class, 'store']);
            Route::put('/cart/{cartItem}', [CartController::class, 'update']);
            Route::delete('/cart/{cartItem}', [CartController::class, 'destroy']);
            Route::post('/cart/checkout', [CartController::class, 'checkout']);

            Route::get('/wishlist', [WishlistController::class, 'index']);
            Route::post('/wishlist/{product}', [WishlistController::class, 'toggle']);
        });
    });

    // ─── Dealer Portal ────────────────────────────────────────────────────
    Route::prefix('dealer')->group(function () {
        Route::post('/register', [DealerAuthController::class, 'register'])->middleware('throttle:5,1');
        Route::post('/login', [DealerAuthController::class, 'login'])->middleware('throttle:10,1');

        Route::middleware(['auth:sanctum', 'role:dealer'])->group(function () {
            Route::get('/profile', [DealerProfileController::class, 'show']);
            Route::put('/profile', [DealerProfileController::class, 'update']);
            Route::get('/credit', [DealerProfileController::class, 'creditInfo']);

            Route::get('/products', [DealerProductController::class, 'index']);
            Route::get('/products/{slug}', [DealerProductController::class, 'show']);

            Route::apiResource('/orders', DealerOrderController::class)->only(['index', 'show', 'store']);
            Route::post('/orders/{order}/cancel', [DealerOrderController::class, 'cancel']);
        });
    });

    // ─── Admin — Super Admin / Company Admin ──────────────────────────────
    Route::prefix('admin')->middleware(['auth:sanctum', 'role:super-admin|company-admin'])->group(function () {

        Route::get('/dashboard', [AdminDashboard::class, 'index']);

        // Branches
        Route::apiResource('/branches', BranchController::class);
        Route::patch('/branches/{branch}/toggle-status', [BranchController::class, 'toggleStatus']);
        Route::get('/branches/{branch}/dashboard', [BranchController::class, 'dashboard']);
        Route::get('/branches/{branch}/performance', [BranchController::class, 'performance']);

        // Users & Roles
        Route::apiResource('/users', UserController::class);
        Route::post('/users/{user}/assign-role', [UserController::class, 'assignRole']);
        Route::post('/users/{user}/revoke-role', [UserController::class, 'revokeRole']);
        Route::apiResource('/roles', RoleController::class);

        // Products
        Route::apiResource('/products', ProductController::class);
        Route::post('/products/{product}/images', [ProductController::class, 'uploadImages']);
        Route::delete('/products/{product}/images/{media}', [ProductController::class, 'deleteImage']);
        Route::apiResource('/categories', CategoryController::class);

        // Suppliers
        Route::apiResource('/suppliers', SupplierController::class);

        // Dealers Management
        Route::get('/dealers', [DealerManagementController::class, 'index']);
        Route::get('/dealers/{dealer}', [DealerManagementController::class, 'show']);
        Route::post('/dealers/{dealer}/approve', [DealerManagementController::class, 'approve']);
        Route::post('/dealers/{dealer}/reject', [DealerManagementController::class, 'reject']);
        Route::put('/dealers/{dealer}/pricing', [DealerManagementController::class, 'updatePricing']);
        Route::put('/dealers/{dealer}/credit', [DealerManagementController::class, 'updateCredit']);

        // Transfers — Cross-branch oversight
        Route::get('/transfers', [TransferController::class, 'adminIndex']);

        // Reports
        Route::prefix('reports')->group(function () {
            Route::get('/stock', [ReportController::class, 'stock']);
            Route::get('/sales', [ReportController::class, 'sales']);
            Route::get('/branch-performance', [ReportController::class, 'branchPerformance']);
            Route::get('/transfers', [ReportController::class, 'transfers']);
            Route::get('/profitability', [ReportController::class, 'profitability']);
            Route::get('/dealer-sales', [ReportController::class, 'dealerSales']);
            Route::post('/export/{type}', [ReportController::class, 'export']);
        });

        // Analytics
        Route::prefix('analytics')->group(function () {
            Route::get('/overview', [AnalyticsController::class, 'overview']);
            Route::get('/revenue', [AnalyticsController::class, 'revenue']);
            Route::get('/top-products', [AnalyticsController::class, 'topProducts']);
            Route::get('/low-stock', [AnalyticsController::class, 'lowStock']);
            Route::get('/branch-performance', [AnalyticsController::class, 'branchPerformance']);
        });

        // Notifications
        Route::post('/notifications/broadcast', [NotificationController::class, 'broadcast']);
        Route::get('/notifications', [NotificationController::class, 'index']);
    });

    // ─── Branch Manager Portal ────────────────────────────────────────────
    Route::prefix('branch')->middleware(['auth:sanctum', 'branch.access'])->group(function () {

        Route::get('/dashboard', [BranchDashboardController::class, 'index']);
        Route::get('/kpis', [BranchDashboardController::class, 'kpis']);

        // Warehouses
        Route::apiResource('/warehouses', WarehouseController::class);
        Route::get('/warehouses/{warehouse}/stock', [WarehouseController::class, 'stock']);

        // Inventory
        Route::get('/inventory', [InventoryController::class, 'index']);
        Route::get('/inventory/{product}', [InventoryController::class, 'show']);
        Route::post('/inventory/adjust', [InventoryController::class, 'adjust']);
        Route::get('/inventory/low-stock', [InventoryController::class, 'lowStock']);
        Route::get('/inventory/expiring', [InventoryController::class, 'expiring']);
        Route::post('/inventory/batch', [InventoryController::class, 'batchCreate']);

        // Stock Movements
        Route::get('/stock-movements', [StockMovementController::class, 'index']);
        Route::get('/stock-movements/{movement}', [StockMovementController::class, 'show']);

        // Transfers
        Route::apiResource('/transfers', TransferController::class);
        Route::post('/transfers/{transfer}/approve', [TransferController::class, 'approve']);
        Route::post('/transfers/{transfer}/reject', [TransferController::class, 'reject']);
        Route::post('/transfers/{transfer}/ship', [TransferController::class, 'ship']);
        Route::post('/transfers/{transfer}/receive', [TransferController::class, 'receive']);
        Route::post('/transfers/{transfer}/cancel', [TransferController::class, 'cancel']);

        // Orders
        Route::apiResource('/orders', BranchOrderController::class);
        Route::patch('/orders/{order}/status', [BranchOrderController::class, 'updateStatus']);

        // Purchase
        Route::apiResource('/purchase-orders', PurchaseController::class);
        Route::post('/purchase-orders/{po}/receive', [PurchaseController::class, 'receive']);
        Route::post('/purchase-orders/{po}/pay', [PurchaseController::class, 'pay']);

        // Finance
        Route::get('/finance/summary', [FinanceController::class, 'summary']);
        Route::get('/finance/income', [FinanceController::class, 'incomeIndex']);
        Route::post('/finance/income', [FinanceController::class, 'storeIncome']);
        Route::get('/finance/expenses', [FinanceController::class, 'expenseIndex']);
        Route::post('/finance/expenses', [FinanceController::class, 'storeExpense']);
        Route::get('/finance/cash-flow', [FinanceController::class, 'cashFlow']);
    });
});
