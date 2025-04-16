<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;

class TransactionSeeder extends Seeder {
    public function run(): void {
        Transaction::factory()->count(5)->create()->each(function ($transaction) {
            $items = Item::inRandomOrder()->take(3)->get();
        
            foreach ($items as $item) {
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'item_id' => $item->id,
                    'quantity' => rand(1, 5),
                    'price_at_time' => $item->price,
                ]);
            }

            $transaction->update([
                'total' => $transaction->details()->sum(DB::raw('quantity * price_at_time')),
            ]);
        });
    }
}