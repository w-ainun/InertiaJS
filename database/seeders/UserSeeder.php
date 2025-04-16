<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

use Faker\Factory as Faker;
use Illuminate\Support\Str;

class UserSeeder extends Seeder {
    public function run(): void {
        // $faker = Faker::create('id_ID');
        User::create([
            "username" => "rhindottire",
            "email" => "230411100197@student.trunojoyo.ac.id",
            "password" => Hash::make("admin123"),
            "role" => "ADMIN",
            "email_verified_at" => now(),
            "remember_token" => Str::random(10),
        ]);

        User::create([
            "username" => "Roni",
            "email" => "230411100025@student.trunojoyo.ac.id",
            "password" => Hash::make("client123"),
            "role" => "CLIENT",
            "email_verified_at" => now(),
            "remember_token" => Str::random(10),
        ]);

        User::factory()
            ->count(8)
            ->state(['role' => 'CLIENT'])
            ->create();
    }
}