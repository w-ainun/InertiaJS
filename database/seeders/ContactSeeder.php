<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder {
  public function run(): void {
    $users = User::where('role', '!=', 'ADMIN')->get();

    Contact::factory()
      ->count(50)
      ->create([
        'user_id' => function() use ($users) {
          return $users->random()->id;
        },
    ]);
  }
}