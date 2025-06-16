<?php

namespace App\Http\Controllers\Client;

use App\Models\Rating;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class RatingController extends Controller
{
    /**
     * Store a newly created rating in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Inertia\Response
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'transaction_id' => 'required|exists:transactions,id',
                'item_id' => 'required|exists:items,id',
                'score' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string|max:500',
            ]);
        } catch (ValidationException $e) {
            // For validation errors, return back with errors using Inertia's way
            return redirect()->back()->withErrors($e->errors());
        }

        $user = Auth::user();

        if (!$user) {
            return redirect()->back()->with('error', 'Unauthorized: Please log in to submit a review.');
        }

        $transaction = Transaction::where('id', $validatedData['transaction_id'])
                                  ->where('client_id', $user->id)
                                  ->first();

        if (!$transaction) {
            return redirect()->back()->with('error', 'Transaction not found or does not belong to your account.');
        }

        $existingRating = Rating::where('transaction_id', $validatedData['transaction_id'])
                                ->where('item_id', $validatedData['item_id'])
                                ->where('client_id', $user->id)
                                ->first();

        if ($existingRating) {
            return redirect()->back()->with('error', 'You have already reviewed this item for this transaction.');
        }

        $validatedData['client_id'] = $user->id;

        Rating::create([
            'item_id' => $validatedData['item_id'],
            'transaction_id' => $validatedData['transaction_id'],
            'client_id' => $validatedData['client_id'],
            'score' => $validatedData['score'],
            'comment' => $validatedData['comment'],
        ]);

        // On success, redirect back with a success flash message
        return redirect()->back()->with('success', 'Review successfully added!');
    }

    /**
     * Display a listing of the ratings.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Fetch recent ratings with their associated client (user) and item details
        $reviews = Rating::with(['client', 'item'])
                         ->latest() // Order by latest reviews
                         ->limit(3) // Get the top 3 reviews, or adjust as needed
                         ->get()
                         ->map(function ($review) {
                             return [
                                 'id' => $review->id,
                                 'client_name' => $review->client ? $review->client->name : 'Anonymous', // Assuming 'name' column in users table
                                 'client_city' => $review->client ? $review->client->city : 'Unknown', // Assuming 'city' column in users table
                                 'score' => $review->score,
                                 'comment' => $review->comment,
                                 'date' => $review->created_at->format('d F, Y'), // Format the date
                                 // You can add item details if needed, e.g., $review->item->name
                             ];
                         });

        // Calculate average rating and total reviews
        $averageRating = Rating::avg('score');
        $totalReviews = Rating::count();

        // Pass the reviews, average rating, and total reviews to the Inertia component
        return Inertia::render('Welcome', [ // Assuming your main page is 'Welcome.jsx' or 'Home.jsx', adjust accordingly
            'reviews' => $reviews,
            'averageRating' => round($averageRating, 1), // Round to one decimal place
            'totalReviews' => $totalReviews,
        ]);
    }
}