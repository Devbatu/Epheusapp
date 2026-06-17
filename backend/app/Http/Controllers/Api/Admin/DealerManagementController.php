<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Domain\Dealer\Models\Dealer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DealerManagementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $dealers = Dealer::query()
            ->when($request->input('status'), fn ($q, $s) => $q->where('status', $s))
            ->when($request->input('search'), fn ($q, $s) => $q
                ->whereRaw('LOWER(company_name) LIKE ?', ['%' . mb_strtolower($s) . '%']))
            ->withCount('orders')
            ->latest()
            ->paginate($request->input('per_page', 20));

        $dealers->getCollection()->transform(fn (Dealer $d) => [
            'id'              => $d->id,
            'company_name'    => $d->company_name,
            'contact_name'    => $d->contact_name,
            'email'           => $d->email,
            'phone'           => $d->phone,
            'city'            => $d->city,
            'status'          => $d->status,
            'credit_limit'    => (float) $d->credit_limit,
            'current_balance' => (float) $d->current_balance,
            'discount_rate'   => (float) $d->discount_rate,
            'orders_count'    => $d->orders_count,
            'created_at'      => $d->created_at?->toIso8601String(),
        ]);

        return response()->json($dealers);
    }

    public function show(string $id): JsonResponse
    {
        $dealer = Dealer::withCount('orders')->findOrFail($id);

        return response()->json(['data' => $dealer]);
    }

    public function approve(string $id): JsonResponse
    {
        $dealer = Dealer::findOrFail($id);
        $dealer->update([
            'status' => 'approved',
            'approved_by' => request()->user()->id,
            'approved_at' => now(),
            'credit_limit' => $dealer->credit_limit ?: 50000,
        ]);

        return response()->json(['message' => 'Dealer approved.', 'data' => $dealer]);
    }

    public function reject(Request $request, string $id): JsonResponse
    {
        $dealer = Dealer::findOrFail($id);
        $dealer->update(['status' => 'rejected', 'rejection_reason' => $request->input('reason')]);

        return response()->json(['message' => 'Dealer rejected.', 'data' => $dealer]);
    }

    public function updatePricing(Request $request): JsonResponse { return response()->json(['message' => 'Not implemented yet.'], 501); }
    public function updateCredit(Request $request): JsonResponse { return response()->json(['message' => 'Not implemented yet.'], 501); }
}
