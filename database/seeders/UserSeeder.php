<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            "username" => "ACHMAD RIDHO FA'IZ",
            "email" => "230411100197@student.trunojoyo.ac.id",
            "password" => Hash::make("admin123"),
            "avatar" => null,
            "role" => "ADMIN",
            "status" => "active",
            "email_verified_at" => now(),
            "remember_token" => Str::random(10),
        ]);

        User::create([
            "username" => "Seinal Arifin",
            "email" => "230411100149@student.trunojoyo.ac.id",
            "password" => Hash::make("courier123"),
            "avatar" => null,
            "role" => "COURIER",
            "status" => "active",
            "email_verified_at" => now(),
            "remember_token" => Str::random(10),
        ]);

        User::create([
            "username" => "Ronifirnanda",
            "email" => "230411100025@student.trunojoyo.ac.id",
            "password" => Hash::make("client123"),
            "avatar" => null,
            "role" => "CLIENT",
            "status" => "active",
            "email_verified_at" => now(),
            "remember_token" => Str::random(10),
        ]);

        for ($i = 1; $i <= 5; $i++) {
            User::create([
                "username" => "admin{$i}",
                "email" => "admin{$i}@example.com",
                "password" => Hash::make("password123"),
                "avatar" => null,
                "role" => "ADMIN",
                "status" => "active",
                "email_verified_at" => now(),
                "remember_token" => Str::random(10),
            ]);
        }

        User::factory()->count(10)->create([
            "role" => "COURIER",
        ]);

        $inactiveClients = User::factory()->count(5)->make([
            'role' => 'CLIENT',
            'status' => 'inactive',
        ]);
        $activeClients = User::factory()->count(15)->make([
            'role' => 'CLIENT',
            'status' => 'active',
        ]);

        $clients = $inactiveClients->concat($activeClients)->shuffle();
        $clients->each(fn($client) => $client->save());

        User::where('role', 'ADMIN')->skip(1)->inRandomOrder()->first()?->delete();
        User::where('role', 'COURIER')->skip(1)->inRandomOrder()->first()?->delete();
        User::where('role', 'CLIENT')->skip(1)->inRandomOrder()->first()?->delete();
    }
}
