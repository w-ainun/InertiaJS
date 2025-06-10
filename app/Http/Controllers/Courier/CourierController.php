<?php

namespace App\Http\Controllers\Courier;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourierController extends Controller
{
    public function index()
    {
        $orders = Transaction::with([
            'user:id,username',
            'address:id,street,more,city,province,post_code,country' // Eager load alamat pengiriman
        ])
        ->where('delivery_option', 'delivery') // Hanya tampilkan pesanan yang perlu diantar
        ->orderBy('created_at', 'desc')
        ->get();

        return Inertia::render('courier/dashboard-courier', [
            'orders' => $orders,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'delivery_status' => 'required|in:menunggu,diambil,sedang dikirim,selesai'
        ]);

        $order = Transaction::findOrFail($id);
        $order->delivery_status = $request->delivery_status;

        if ($request->delivery_status === 'sedang dikirim') {
            $order->status = 'dalam_pengiriman'; 
        }

        if ($request->delivery_status === 'selesai') {
            $order->status = 'diterima'; 
        }

        $order->save();

        return back()->with('message', 'Status pengiriman berhasil diperbarui.');
    }
}