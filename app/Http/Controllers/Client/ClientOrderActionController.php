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
        // Authorization: Ensure the authenticated user owns this transaction
        if (Auth::id() !== $transaction->client_id) {
            return redirect()->route('Homepage')->with('error', 'Unauthorized action.');
        }

        // Check if order status allows this action
        $allowedStatuses = ['dalam_pengiriman'];
        if ($transaction->delivery_option === 'pickup') {
            // For pickup, perhaps it can be marked received once 'dikemas' (packed/ready for pickup)
            $allowedStatuses[] = 'dikemas';
        }

        if (!in_array($transaction->status, $allowedStatuses)) {
            return back()->with('error', 'Order cannot be marked as received at its current status.');
        }

        $transaction->status = 'diterima'; // Order received by customer
        $transaction->user_marked_received_at = Carbon::now();
        $transaction->save();

        // Optionally, trigger an event or notification here

        return redirect()->route('pesanan-saya')->with('success', 'Order successfully marked as received!');
    }

    public function showReceipt(Request $request, Transaction $transaction)
    {
        // Authorization
        if (Auth::id() !== $transaction->client_id) {
            return redirect()->route('Homepage')->with('error', 'Unauthorized action.');
        }

        $transaction->load([
            'details.item:id,name,unit',
            'address:id,street,more,city,province,post_code,country',
            'user:id,username,email' // Load basic user info, changed 'name' to 'username'
        ]);

        // Store contact details (could come from config or a settings table)
        $storeContact = [
            'name' => config('app.name', 'Your Store Name'),
            'address' => config('shop.store_address', '123 Store Street, Your City'),
            'phone' => config('shop.store_phone', '0812-3456-7890'),
            'email' => config('shop.store_email', 'support@yourstore.com'),
        ];

        // Generate order number display if not already present (consistent with PesananSaya.tsx)
        // Though it's better if order_number_display is a persisted attribute or an accessor in the model
        $order_number_display = 'RB-' . $transaction->id . '-' . $transaction->created_at->timestamp;


        return Inertia::render('Client/OrderReceipt', [
            'transaction' => $transaction,
            'transaction_details_items' => $transaction->details, // Send details separately if needed for structure
            'order_number_display' => $order_number_display,
            'storeContact' => $storeContact,
            'client' => $transaction->user, // Pass the client/user data
            'deliveryAddress' => $transaction->address, // Pass the delivery address
        ]);
    }
}