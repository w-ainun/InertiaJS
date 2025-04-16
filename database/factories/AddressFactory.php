<?php

namespace Database\Factories;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Factories\Factory;

class AddressFactory extends Factory {
    public function definition(): array {
        return [
            'contact_id' => Contact::factory(),
            'post_code' => $this->faker->postcode(),
            'country' => $this->faker->country(),
            'province' => $this->faker->state(),
            'street' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'more' => $this->faker->shuffleString(),
        ];
    }
}