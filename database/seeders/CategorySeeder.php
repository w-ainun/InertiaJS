<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder {
    public function run(): void {
        $categories = [
        [
            'name' => 'Kue Basah',
            'image_url' => '/img/categories/kue-basah.png',
            'description' => 'Aneka kue basah pilihan terbaik',
        ],
        [
            'name' => 'Kue Kering',
            'image_url' => '/img/categories/kue-kering.png',
            'description' => 'Beli banyak makin hemat!',
        ],
        [
            'name' => 'Kue Modern',
            'image_url' => '/img/categories/kue-modern.png',
            'description' => 'Best Seller, MULAI DARI 3.500!',
        ],
        [
            'name' => 'Gorengan',
            'image_url' => '/img/categories/gorengan.png',
            'description' => 'paling laris!',
        ],
        [
            'name' => 'Minuman',
            'image_url' => '/img/categories/minuman.png',
            'description' => 'NIkmati Kesegaran hanya dengan 10.000!',
        ],
        [
            'name' => 'Puding',
            'image_url' => '/img/categories/puding.png',
            'description' => 'Paling diminati',
        ],
    ];

        foreach ($categories as $category) {
        DB::table('categories')->insert([
            'name' => $category['name'],
            'slug' => Str::slug($category['name']),
            'image_url' => $category['image_url'],
            'description' => $category['description'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
    }
}
