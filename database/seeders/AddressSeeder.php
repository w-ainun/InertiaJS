<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Contact;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AddressSeeder extends Seeder {
    public function run(): void {
        $contacts = Contact::all();
        Address::factory()
            ->count(50)
            ->make()
            ->each(function ($address) use ($contacts) {
                $address->contact_id = $contacts->random()->id;
                $address->save();
            });
    }
}