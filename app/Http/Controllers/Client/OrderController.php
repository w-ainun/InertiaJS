<?php

use App\Models\Transaction;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // ... method Anda yang lain (index, show, etc.)

    /**
     * Check the current status of a transaction.
     *
     * @param  Transaction $transaction
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkStatus(Transaction $transaction)
    {
        // Pastikan hanya pemilik transaksi yang bisa mengecek
        if ($transaction->user_id !== auth()->id()) {
            return response()->json(['status' => 'unauthorized'], 403);
        }

        return response()->json(['status' => $transaction->status]);
    }
}