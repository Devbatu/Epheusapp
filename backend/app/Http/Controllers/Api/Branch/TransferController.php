<?php

namespace App\Http\Controllers\Api\Branch;

use App\Http\Controllers\Controller;
use App\Domain\Transfer\Services\TransferService;
use App\Domain\Transfer\Models\TransferRequest;
use App\Http\Requests\Transfer\CreateTransferRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class TransferController extends Controller
{
    public function __construct(private readonly TransferService $transferService) {}

    public function index(Request $request): JsonResponse
    {
        $transfers = QueryBuilder::for(TransferRequest::class)
            ->allowedFilters([
                AllowedFilter::exact('status'),
                AllowedFilter::exact('from_branch_id'),
                AllowedFilter::exact('to_branch_id'),
                AllowedFilter::scope('for_branch', 'forBranch'),
            ])
            ->allowedSorts(['created_at', 'status', 'transfer_number'])
            ->allowedIncludes(['fromBranch', 'toBranch', 'items.product', 'items.variant'])
            ->where(function ($q) use ($request) {
                $branchId = $request->user()->branch_id;
                $q->where('from_branch_id', $branchId)
                    ->orWhere('to_branch_id', $branchId);
            })
            ->paginate($request->get('per_page', 20));

        return response()->json($transfers);
    }

    public function store(CreateTransferRequest $request): JsonResponse
    {
        $transfer = $this->transferService->createTransfer(
            $request->validated(),
            $request->user()->id,
        );

        return response()->json([
            'message'  => 'Transfer request created successfully.',
            'transfer' => $transfer->load('items.product'),
        ], 201);
    }

    public function show(TransferRequest $transfer): JsonResponse
    {
        return response()->json([
            'transfer' => $transfer->load([
                'fromBranch', 'toBranch',
                'fromWarehouse', 'toWarehouse',
                'items.product', 'items.variant', 'items.batch',
            ]),
        ]);
    }

    public function approve(Request $request, TransferRequest $transfer): JsonResponse
    {
        $this->authorize('approve', $transfer);

        $transfer = $this->transferService->approve($transfer, $request->user()->id);

        return response()->json([
            'message'  => 'Transfer approved.',
            'transfer' => $transfer,
        ]);
    }

    public function reject(Request $request, TransferRequest $transfer): JsonResponse
    {
        $this->authorize('approve', $transfer);
        $request->validate(['reason' => 'required|string|max:500']);

        $transfer = $this->transferService->reject($transfer, $request->user()->id, $request->reason);

        return response()->json(['message' => 'Transfer rejected.', 'transfer' => $transfer]);
    }

    public function ship(Request $request, TransferRequest $transfer): JsonResponse
    {
        $this->authorize('ship', $transfer);
        $request->validate([
            'shipping_carrier' => 'nullable|string',
            'tracking_number'  => 'nullable|string',
            'items'            => 'required|array',
        ]);

        $transfer = $this->transferService->ship($transfer, $request->user()->id, $request->validated());

        return response()->json(['message' => 'Transfer shipped.', 'transfer' => $transfer]);
    }

    public function receive(Request $request, TransferRequest $transfer): JsonResponse
    {
        $this->authorize('receive', $transfer);
        $request->validate(['items' => 'required|array']);

        $transfer = $this->transferService->receive($transfer, $request->user()->id, $request->validated());

        return response()->json(['message' => 'Transfer received.', 'transfer' => $transfer]);
    }

    public function cancel(Request $request, TransferRequest $transfer): JsonResponse
    {
        if (! $transfer->isCancellable()) {
            return response()->json(['message' => 'This transfer cannot be cancelled.'], 422);
        }

        $request->validate(['reason' => 'required|string']);

        $transfer = $this->transferService->reject($transfer, $request->user()->id, $request->reason);

        return response()->json(['message' => 'Transfer cancelled.', 'transfer' => $transfer]);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $transfers = QueryBuilder::for(TransferRequest::class)
            ->allowedFilters([
                AllowedFilter::exact('status'),
                AllowedFilter::exact('from_branch_id'),
                AllowedFilter::exact('to_branch_id'),
            ])
            ->allowedSorts(['created_at', 'status'])
            ->allowedIncludes(['fromBranch', 'toBranch', 'items'])
            ->paginate($request->get('per_page', 20));

        return response()->json($transfers);
    }
}
