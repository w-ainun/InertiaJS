<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * php artisan migrate:fresh --seed
     * php artisan migrate:rollback
     * php artisan migrate:refresh
     * php artisan config:clear
     * php artisan cache:clear
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            // ContactSeeder::class,
        ]);
    }
}
