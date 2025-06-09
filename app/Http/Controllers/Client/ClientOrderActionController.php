<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

class ClientOrderActionController extends Controller
{
    public function markAsReceived(Request $request, Transaction $transaction)
    {
        if (Auth::id() !== $transaction->client_id) {
            return redirect()->route('Homepage')->with('error', 'Unauthorized action.');
        }

        $allowedDeliveryStatuses = ['sedang dikirim', 'selesai'];
        
        if ($transaction->delivery_option === 'pickup' && $transaction->delivery_status === 'diambil') {
            $allowedDeliveryStatuses[] = 'diambil';
        }

        if (!in_array($transaction->delivery_status, $allowedDeliveryStatuses)) {
            return back()->with('error', 'Pesanan belum dapat ditandai sebagai diterima pada status pengiriman saat ini.');
        }

        $transaction->status = 'selesai'; 
        $transaction->delivery_status = 'selesai';
        $transaction->user_marked_received_at = Carbon::now();
        $transaction->save();

        return redirect()->route('pesanan-saya')->with('success', 'Pesanan berhasil ditandai sebagai selesai!');
    }

    public function showReceipt(Request $request, Transaction $transaction)
    {
        if (Auth::id() !== $transaction->client_id) {
            return redirect()->route('Homepage')->with('error', 'Unauthorized action.');
        }

        $transaction->load([
            'details.item:id,name,unit',
            'address:id,street,more,city,province,post_code,country',
            'user:id,username,email'
        ]);

        $storeContact = [
            'name' => config('app.name', 'Your Store Name'),
            'address' => config('shop.store_address', '123 Store Street, Your City'),
            'phone' => config('shop.store_phone', '0812-3456-7890'),
            'email' => config('shop.store_email', 'support@yourstore.com'),
        ];

        $order_number_display = 'RB-' . $transaction->id . '-' . $transaction->created_at->timestamp;

        return Inertia::render('Client/OrderReceipt', [
            'transaction' => $transaction,
            'transaction_details_items' => $transaction->details,
            'order_number_display' => $order_number_display,
            'storeContact' => $storeContact,
            'client' => $transaction->user,
            'deliveryAddress' => $transaction->address,
        ]);
    }
}