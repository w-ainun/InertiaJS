<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class UserSeeder extends Seeder {
    public function run(): void {
        $edho = User::factory()->edho()->admin()->create();
        User::factory()->ainun()->create();
        User::factory()->khoir()->create();
        User::factory()->seinal()->create();
        User::factory()->yichang()->create();

        $roni = User::factory()->roni()->courier()->create();
        Contact::factory()->create([
            'user_id'   => $roni->id,
            'name'      => 'Backend Sejati',
            'phone'     => '081234567890',
            'gender'    => 'MAN',
            'birthday'  => '1945-08-17',
            'profile'   => 'https://example.com/roni.jpg',
        ]);
        $prasetyo = User::factory()->prasetyo()->client()->create();
        $prasetyoContact = Contact::factory()->create([
            'user_id'   => $prasetyo->id,
            'name'      => 'Fullstacknya UTM',
            'phone'     => '089876543210',
            'gender'    => 'MAN',
            'birthday'  => '2000-02-02',
            'profile'   => 'https://example.com/prasetyo.jpg',
            'favourite' => ['Pudding', 'Ice Cream'],
        ]);
        Address::factory()->create([
            'contact_id' => $prasetyoContact->id,
            'post_code' => '12345',
            'country'   => 'Indonesia',
            'province'  => 'Jawa Timur',
            'city'      => 'Bangkalan',
            'street'    => 'Jl. Telang No.1',
            'more'      => 'RT 01/RW 02',
        ]);

        User::factory()->nur()->create();
        User::factory()->suhaila()->create();
        User::factory()->layli()->create();

        User::factory()->count(10)->create([
            "role" => "COURIER",
        ]);
        $inactiveClients = User::factory()->count(40)->make([
            'role' => 'CLIENT',
            'status' => 'inactive',
        ]);
        $activeClients = User::factory()->count(40)->make([
            'role' => 'CLIENT',
            'status' => 'active',
        ]);
        $clients = $inactiveClients->concat($activeClients)->shuffle();
        $clients->each(fn($client) => $client->save());

        $userIds = User::where('role', '!=', 'ADMIN')->pluck('id')->toArray();
        Contact::factory()
            ->count(250)
            ->make()
            ->each(function (Contact $contact) use ($userIds) {
                $contact->user_id = Arr::random($userIds);
                $contact->save();
            });


        $ccIDs = Contact::whereHas('user', fn($q) => $q->where('role', 'CLIENT'))
                ->pluck('id')
                ->toArray();
        Address::factory()
            ->count(500)
            ->make()
            ->each(function (Address $address) use ($ccIDs) {
                $address->contact_id = Arr::random($ccIDs);
                $address->save();
            });
// ================================================================== //
        User::whereNotIn('id', [$edho->id, $roni->id, $prasetyo->id])
            ->inRandomOrder()
            ->limit(25)
            ->get()
            ->each(fn($user) => $user->delete());
        Contact::whereNotIn('user_id', [$roni->id, $prasetyo->id])
            ->inRandomOrder()
            ->limit(100)
            ->get()
            ->each(fn($contact) => $contact->delete());
    }
}
