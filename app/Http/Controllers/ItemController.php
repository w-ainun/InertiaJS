<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Item::with('category')
                        ->where('is_available', true);

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            $items = $query->orderBy('created_at', 'desc')
                          ->get();

            // Uncomment for debugging
            // \Log::info('Search query:', [
            //     'search' => $request->search,
            //     'total_results' => $items->count()
            // ]);

            return Inertia::render('Homepage', [
                'items' => $items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'description' => $item->description,
                        'price' => $item->price,
                        'image_url' => $item->image_url,
                        'category_slug' => $item->category?->slug,
                        'expired_at' => $item->expired_at,
                        'stock' => $item->stock
                    ];
                }),
                'search' => $request->search,
                'total' => $items->count()
            ]);

        } catch (\Exception $e) {
            // Silent error handling
            return Inertia::render('Homepage', [
                'items' => [],
                'search' => $request->search,
                'total' => 0
            ]);
        }
    }
}


