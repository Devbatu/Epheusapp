<?php

namespace App\Domain\Transfer\Events;

use App\Domain\Transfer\Models\TransferRequest;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TransferShipped
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly TransferRequest $transfer,
    ) {}
}
