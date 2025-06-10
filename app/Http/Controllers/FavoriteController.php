<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Favorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteController extends Controller
{
    public function toggle(Request $request): JsonResponse
    {
        $request->validate(['item_id' => 'required|exists:items,id']);
        
        /** @var User $user */
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $itemId = $request->item_id;
        $favorite = $user->favorites()->where('item_id', $itemId)->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json(['status' => 'removed']);
        }

        $user->favorites()->create(['item_id' => $itemId]);
        return response()->json(['status' => 'added']);
    }

    public function index(): Response
    {
        /** @var User $user */
        $user = Auth::user();
        
        if (!$user) {
            return Inertia::render('Auth/Login');
        }

        try {
            $favorites = $user->favoritedItems()
                ->with('category')
                ->latest()
                ->get();

            return Inertia::render('Favorites/Index', [
                'favorites' => $favorites,
                'status' => session('status')
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Favorites/Index', [
                'favorites' => [],
                'error' => 'Failed to load favorites'
            ]);
        }
    }
}
