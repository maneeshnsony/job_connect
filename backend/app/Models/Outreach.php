<?php

namespace App\Models;

use Database\Factories\OutreachFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Outreach extends Model
{
    /** @use HasFactory<OutreachFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company',
        'sector',
        'recruiter',
        'linkedin',
        'msg_sent',
        'reply',
        'next_action',
    ];

    protected function casts(): array
    {
        return [
            'msg_sent' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
