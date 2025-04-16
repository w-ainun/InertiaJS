<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder {
    public function run(): void {
        $clients = User::where('role', 'CLIENT')->get();
        Contact::factory()
            ->count(20)
            ->make()
            ->each(function ($contact) use ($clients) {
                $contact->client_id = $clients->random()->id;
                $contact->save();
            });
    }
}
