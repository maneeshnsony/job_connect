<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OutreachNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'outreach_id',
        'note',
    ];

    public function outreach(): BelongsTo
    {
        return $this->belongsTo(Outreach::class);
    }
}
