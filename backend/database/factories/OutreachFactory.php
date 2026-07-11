<?php

namespace Database\Factories;

use App\Models\Outreach;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OutreachFactory extends Factory
{
    protected $model = Outreach::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'company' => fake()->company(),
            'sector' => fake()->randomElement(['Tech', 'Finance', 'Healthcare', 'Education', 'Consulting']),
            'recruiter' => fake()->name(),
            'linkedin' => 'https://linkedin.com/in/' . fake()->userName(),
            'msg_sent' => fake()->dateTimeBetween('-3 months', 'now')->format('Y-m-d'),
            'reply' => fake()->randomElement(['Yes', 'No', 'Pending']),
            'next_action' => fake()->randomElement([
                'Send follow-up email',
                'Schedule call',
                'Send Msg 2 today',
                'Wait for response',
                'Connect on LinkedIn',
            ]),
        ];
    }
}
