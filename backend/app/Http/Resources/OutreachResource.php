<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OutreachResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company' => $this->company,
            'sector' => $this->sector,
            'recruiter' => $this->recruiter,
            'linkedin' => $this->linkedin,
            'msg_sent' => $this->msg_sent?->format('Y-m-d'),
            'reply' => $this->reply,
            'next_action' => $this->next_action,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
