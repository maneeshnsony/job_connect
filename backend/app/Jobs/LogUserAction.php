<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class LogUserAction implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public int $userId,
        public string $action,
        public array $payload = [],
    ) {}

    public function handle(): void
    {
        Log::channel('json')->info('User action', [
            'user_id' => $this->userId,
            'action' => $this->action,
            'payload' => $this->payload,
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
