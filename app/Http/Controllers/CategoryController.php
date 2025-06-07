<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller {
    public function index() {
        $categories = Category::all();
        $defaultCategorySlug = 'kue-basah'; // Slug kategori default

        $selectedCategory = Category::where('slug', $defaultCategorySlug)->first();

        if ($selectedCategory) {
            $items = $selectedCategory->items()->where('is_available', true)->get();
            return Inertia::render('clients/menu', [
                'categories' => $categories,
                'kategori' => $selectedCategory->name,
                'produk' => $items,
                'gambar' => $selectedCategory->image_url,
                'notice' => $selectedCategory->description,
                'currentSlugBeingDisplayed' => $defaultCategorySlug // Memberitahu frontend slug mana yang aktif
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
                'currentSlugBeingDisplayed' => null
            ]);
        }
    }

    public function show($slug) {
        $categories = Category::all(); // Selalu ambil semua kategori untuk navigasi
        $selectedCategory = Category::where('slug', $slug)->firstOrFail();
        $items = $selectedCategory->items()->where('is_available', true)->get();

        return Inertia::render('clients/menu', [
            'categories' => $categories,
            'kategori' => $selectedCategory->name,
            'produk' => $items,
            'gambar' => $selectedCategory->image_url,
            'notice' => $selectedCategory->description,
            'currentSlugBeingDisplayed' => $slug // Slug dari URL adalah yang aktif
        ]);
    }
}