<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Rating;
use Illuminate\Database\Eloquent\Factories\Factory;

class ItemFactory extends Factory {
    public function definition(): array {
        return [
            'rating_id' => Rating::factory(),
            'category_id' => Category::factory(),
            'name' => $this->faker->name(),
            'unit' => $this->faker->randomElement(['pcs', 'pack', 'kg']),
            'price' => $this->faker->numberBetween(1000, 10000),
            'stock' => $this->faker->numberBetween(10, 100),
            'img_url' => $this->faker->imageUrl(200, 200, 'people'),
            'is_available' => $this->faker->booleanValue(),
            'description' => $this->faker->sentences(),
            'discount' => $this->faker->numberBetween(1, 100),
        ];
    }
}