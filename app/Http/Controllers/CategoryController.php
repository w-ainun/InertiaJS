<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Voucher; // Import model Voucher
use Illuminate\Http\Request; // Import Request (sudah ada)
use Inertia\Inertia;
use Carbon\Carbon; // Import Carbon

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        $defaultCategorySlug = 'kue-basah'; // Slug kategori default

        $selectedCategory = Category::where('slug', $defaultCategorySlug)->first();

        // DITAMBAH: Ambil voucher yang aktif dan belum kedaluwarsa
        $vouchers = Voucher::where('is_active', true)
                            ->where('valid_from', '<=', Carbon::now())
                            ->where('valid_until', '>=', Carbon::now())
                            ->get()
                            ->map(function($voucher) {
                                return [
                                    'id' => $voucher->id,
                                    'code' => $voucher->code,
                                    'description' => $voucher->description,
                                    'image_url' => $voucher->image_url, // DITAMBAH: Mengirimkan image_url voucher
                                    'discount_type' => $voucher->discount_type,
                                    'discount_value' => $voucher->discount_value,
                                    'min_purchase_amount' => (float) $voucher->min_purchase_amount,
                                    'max_discount_amount' => (float) $voucher->max_discount_amount, // Cast to float
                                    'usage_limit' => $voucher->usage_limit,
                                    'used_count' => $voucher->used_count,
                                    'valid_from' => $voucher->valid_from->toDateTimeString(),
                                    'valid_until' => $voucher->valid_until->toDateTimeString(),
                                ];
                            });

        if ($selectedCategory) {
            $items = $selectedCategory->items()->where('is_available', true)->get();
            return Inertia::render('clients/menu', [
                'categories' => $categories,
                'kategori' => $selectedCategory->name,
                'produk' => $items,
                'gambar' => $selectedCategory->image_url,
                'notice' => $selectedCategory->description,
                'currentSlugBeingDisplayed' => $defaultCategorySlug,
                'vouchers' => $vouchers, // DITAMBAH: Kirim data voucher
            ]);
        } else {
            // Fallback jika kategori 'kue-basah' tidak ditemukan
            // atau jika Anda ingin menampilkan halaman menu tanpa kategori terpilih
            return Inertia::render('clients/menu', [
                'categories' => $categories,
                'kategori' => null,
                'produk' => [],
                'gambar' => null,
                'notice' => null,
                'currentSlugBeingDisplayed' => null,
                'vouchers' => $vouchers, // DITAMBAH: Kirim data voucher
            ]);
        }
    }

    public function show($slug)
    {
        $categories = Category::all(); // Selalu ambil semua kategori untuk navigasi
        $selectedCategory = Category::where('slug', $slug)->firstOrFail();
        $items = $selectedCategory->items()->where('is_available', true)->get();

        // DITAMBAH: Ambil voucher juga di method show
        $vouchers = Voucher::where('is_active', true)
                            ->where('valid_from', '<=', Carbon::now())
                            ->where('valid_until', '>=', Carbon::now())
                            ->get()
                            ->map(function($voucher) {
                                return [
                                    'id' => $voucher->id,
                                    'code' => $voucher->code,
                                    'description' => $voucher->description,
                                    'image_url' => $voucher->image_url, // DITAMBAH: Mengirimkan image_url voucher
                                    'discount_type' => $voucher->discount_type,
                                    'discount_value' => $voucher->discount_value,
                                    'min_purchase_amount' => (float) $voucher->min_purchase_amount,
                                    'max_discount_amount' => (float) $voucher->max_discount_amount, // Cast to float
                                    'usage_limit' => $voucher->usage_limit,
                                    'used_count' => $voucher->used_count,
                                    'valid_from' => $voucher->valid_from->toDateTimeString(),
                                    'valid_until' => $voucher->valid_until->toDateTimeString(),
                                ];
                            });

        return Inertia::render('clients/menu', [
            'categories' => $categories,
            'kategori' => $selectedCategory->name,
            'produk' => $items,
            'gambar' => $selectedCategory->image_url,
            'notice' => $selectedCategory->description,
            'currentSlugBeingDisplayed' => $slug,
            'vouchers' => $vouchers, // DITAMBAH: Kirim data voucher
        ]);
    }
}