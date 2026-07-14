<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;

class BustOutreachCache implements ShouldQueue
{
    use Queueable;

    public function __construct(public int $userId) {}

    public function handle(): void
    {
        Cache::increment('outreaches:v:'.$this->userId);
    }
}
