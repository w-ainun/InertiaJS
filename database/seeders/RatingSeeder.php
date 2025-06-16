<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rating; // Import the Rating model
use App\Models\Transaction; // Import the Transaction model
use App\Models\Item; // Import the Item model
use App\Models\User; // Import the User model
use Faker\Factory as Faker; // Use Faker for dummy data

class RatingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID'); // Create Faker instance for Indonesian locale

        // Get existing transaction, item, and user IDs
        $transactionIds = Transaction::pluck('id')->toArray();
        $itemIds = Item::pluck('id')->toArray();
        $userIds = User::pluck('id')->toArray(); // Assuming User model represents clients

        // Ensure there are enough IDs to create ratings
        if (empty($transactionIds) || empty($itemIds) || empty($userIds)) {
            $this->command->warn('Cannot seed ratings: Make sure you have seeded transactions, items, and users first.');
            return;
        }

        for ($i = 0; $i < 10; $i++) { // Create 10 sample ratings
            $transactionId = $faker->randomElement($transactionIds);
            $itemId = $faker->randomElement($itemIds);
            $clientId = $faker->randomElement($userIds);

            // Check if a rating already exists for this unique combination
            // This is crucial if you have a unique constraint on (transaction_id, item_id, client_id)
            $existingRating = Rating::where('transaction_id', $transactionId)
                                    ->where('item_id', $itemId)
                                    ->where('client_id', $clientId)
                                    ->first();

            if ($existingRating) {
                // Skip if a rating already exists for this combination
                $i--; // Decrement counter to ensure 10 unique ratings are attempted
                continue;
            }

            Rating::create([
                'transaction_id' => $transactionId,
                'item_id' => $itemId,
                'client_id' => $clientId,
                'score' => $faker->numberBetween(1, 5), // Random score between 1 and 5
                'comment' => $faker->sentence(), // Random sentence as comment
            ]);
        }
    }
}