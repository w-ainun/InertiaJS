<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $search = request('search');
        
        $items = Item::query()
            ->when($search, function($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->get();

        return Inertia::render('Homepage', [
            'items' => $items,
            'search' => $search,
            'total' => $items->count()
        ]);
    }
}
