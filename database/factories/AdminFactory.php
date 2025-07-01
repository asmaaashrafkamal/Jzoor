<?php

namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Admin;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admin>
 */
class AdminFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Admin::class;

    public function definition(): array
    {
        return [
            'full_name' => $this->faker->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => bcrypt('password'), // Or Hash::make('password')
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'type' => $this->faker->randomElement([Admin::SELLER_TYPE, Admin::ADMIN_TYPE,Admin::DELIVERY_TYPE]),
        ];
    }
}