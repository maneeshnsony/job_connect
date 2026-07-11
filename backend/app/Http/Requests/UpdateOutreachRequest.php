<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOutreachRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company' => 'sometimes|string|max:255',
            'sector' => 'sometimes|string|max:255',
            'recruiter' => 'sometimes|string|max:255',
            'linkedin' => 'nullable|url|max:500',
            'msg_sent' => 'nullable|date',
            'reply' => 'nullable|string|in:Yes,No,Pending',
            'next_action' => 'nullable|string|max:500',
        ];
    }
}
