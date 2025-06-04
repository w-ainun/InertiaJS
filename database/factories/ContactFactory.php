<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContactFactory extends Factory {
    public function definition(): array {
        $localPhone = '08' . $this->faker->numerify('##########');
        // $intlPhone = preg_replace('/^0/', '+62', $localPhone);
        $gender = $this->faker->randomElement(['MAN', 'WOMAN']);
        $fakerGender = $gender === 'MAN' ? 'male' : 'female';
        return [
            'name' => $this->faker->name($fakerGender),
            'phone' => $localPhone,
            'profile' => $this->faker->imageUrl(200, 200, 'people'),
            'gender' => $gender,
            'birthday' => $this->faker->date('Y-m-d', '-18 years'),
            'favourite' => $this->faker->randomElements([
                'Kue Basah', 'Kue Kering', 'Kue Modern', 'Gorengan', 'Minuman', 'Pudding'
            ], rand(1, 6)),
        ];
    }
}