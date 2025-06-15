<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Voucher;
use Carbon\Carbon;

class VoucherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Voucher::create([
            'code' => 'FIRSTORDER5',
            'description' => 'Diskon 5% PEMBELIAN PERTAMA',
            'image_url' => '/img/dadar-gulung.png', // DITAMBAH: Path gambar voucher
            'discount_type' => 'percentage',
            'discount_value' => 5.00,
            'min_purchase_amount' => 0.00,
            'valid_from' => Carbon::now()->subMonths(1),
            'valid_until' => Carbon::now()->addYears(1),
            'is_active' => true,
        ]);

        Voucher::create([
            'code' => 'MIN20ITEM10',
            'description' => 'Diskon 10% MINIMAL BELI 20 ITEM',
            'image_url' => '/img/es-teler.png', // DITAMBAH: Path gambar voucher
            'discount_type' => 'percentage',
            'discount_value' => 10.00,
            'min_purchase_amount' => 0.00,
            'max_discount_amount' => 50000.00,
            'valid_from' => Carbon::now()->subMonths(1),
            'valid_until' => Carbon::now()->addYears(1),
            'is_active' => true,
        ]);

        Voucher::create([
            'code' => 'FREESAGU',
            'description' => 'Gratis Sagu Mutiara (senilai Rp 3.500) untuk pembelian di atas Rp 50.000',
            'image_url' => '/img/sagu-mutiara.png', // DITAMBAH: Path gambar voucher
            'discount_type' => 'fixed',
            'discount_value' => 3500.00,
            'min_purchase_amount' => 50000.00,
            'usage_limit' => 100,
            'valid_from' => Carbon::now()->subMonths(1),
            'valid_until' => Carbon::now()->addMonths(6),
            'is_active' => true,
        ]);
    }
}