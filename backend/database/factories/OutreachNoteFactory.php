<?php

namespace Database\Factories;

use App\Models\Outreach;
use App\Models\OutreachNote;
use Illuminate\Database\Eloquent\Factories\Factory;

class OutreachNoteFactory extends Factory
{
    protected $model = OutreachNote::class;

    public function definition(): array
    {
        return [
            'outreach_id' => Outreach::factory(),
            'note' => fake()->paragraph(),
        ];
    }
}
