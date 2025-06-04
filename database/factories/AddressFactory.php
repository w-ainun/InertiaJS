<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AddressFactory extends Factory {
    protected $locale = 'id_ID';

    public function definition(): array {
        $faker = \Faker\Factory::create('id_ID');

        $streetName = $faker->streetName;
        $buildingNumber = $faker->buildingNumber;
        $rt = str_pad(rand(1,99), 3, "0", STR_PAD_LEFT);
        $rw = str_pad(rand(1,99), 3, "0", STR_PAD_LEFT);

        return [
            'post_code' => $faker->postcode,
            'country' => 'Indonesia',
            'province' => $faker->state,
            'city' => $faker->city,
            'street' => "Jl. $streetName No.$buildingNumber",
            'more' => "RT $rt/RW $rw",
        ];
    }
}
