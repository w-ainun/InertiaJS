<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction; // Model Transaksi Anda
use Midtrans\Config as MidtransConfig;
use Midtrans\Notification as MidtransNotification; // Class Notification dari Midtrans
use Illuminate\Support\Facades\Log; // Untuk logging
use Illuminate\Support\Facades\DB; // Jika perlu transaksi DB

class MidtransNotificationController extends Controller
{
    public function __construct()
    {
        // Set konfigurasi Midtrans
        MidtransConfig::$serverKey = config('midtrans.server_key');
        MidtransConfig::$isProduction = config('midtrans.is_production');
        // Tidak perlu isSanitized dan is3ds di sini karena ini adalah server-side handling
    }

    public function handle(Request $request)
    {   
        
        Log::info('Midtrans notification received:', $request->all());
        \Log::info('✅ Masuk ke Midtrans Notification Controller', $request->all());
        try {
            // Terima notifikasi dalam bentuk JSON
            $notification = new MidtransNotification(); // Secara otomatis akan mengambil payload dari php://input

            $transactionStatus = $notification->transaction_status;
            $paymentType = $notification->payment_type; // e.g., gopay, credit_card
            $orderIdMidtrans = $notification->order_id; // Ini adalah order_id yang Anda kirim ke Midtrans
            $fraudStatus = $notification->fraud_status;
            $grossAmount = $notification->gross_amount; // Jumlah yang dibayarkan

            // --- Dapatkan ID Transaksi dari orderIdMidtrans ---
            // Berdasarkan implementasi, order_id Anda adalah "TRANSACTION_ID-TIMESTAMP"
            $orderIdParts = explode('-', $orderIdMidtrans);
            $transactionId = $orderIdParts[0]; // Ambil bagian pertama sebagai ID transaksi internal

            $transaction = Transaction::find($transactionId);

            if (!$transaction) {
                Log::error("Midtrans Webhook: Transaction with ID {$transactionId} (from order_id: {$orderIdMidtrans}) not found.");
                return response()->json(['message' => 'Transaction not found, but notification acknowledged.'], 200);
            }

            // Verifikasi signature key (library Midtrans PHP v2 handle this automatically upon object creation)
            // Additional check example (optional, library should cover it):
            // $localSignatureKey = hash('sha512', $notification->order_id . $notification->status_code . $notification->gross_amount . config('midtrans.server_key'));
            // if ($notification->signature_key !== $localSignatureKey) {
            //     Log::error("Midtrans Webhook: Invalid signature for order_id {$orderIdMidtrans}.");
            //     return response()->json(['message' => 'Invalid signature'], 403);
            // }


            // Hindari pembaruan ganda untuk status final
            if (in_array($transaction->status, ['paid', 'canceled', 'failed', 'expired'])) {
                 Log::info("Midtrans Webhook: Transaction {$transaction->id} already has a final status '{$transaction->status}'. Notification for '{$transactionStatus}' (payment_type: {$paymentType}) ignored to prevent override.");
                 return response()->json(['message' => 'Transaction already processed.'], 200);
            }


            // --- Update Status Transaksi ---
            DB::beginTransaction();
            try {
                $newStatus = $transaction->status;
                $updatePaymentMethod = true;

                if ($transactionStatus == 'capture') {
                    if ($fraudStatus == 'challenge') {
                        $newStatus = 'pending'; // atau 'challenge' jika Anda memiliki status tersebut
                        Log::info("Midtrans Webhook: Transaction {$transaction->id} challenged. Payment type: {$paymentType}.");
                    } elseif ($fraudStatus == 'accept') {
                        $newStatus = 'paid';
                        Log::info("Midtrans Webhook: Transaction {$transaction->id} successfully captured and paid. Payment type: {$paymentType}.");
                    }
                } elseif ($transactionStatus == 'settlement') {
                    $newStatus = 'paid';
                    Log::info("Midtrans Webhook: Transaction {$transaction->id} settled and paid. Payment type: {$paymentType}.");
                } elseif ($transactionStatus == 'pending') {
                    $newStatus = 'pending';
                    // Jangan update payment method jika masih pending dari Midtrans, kecuali ini notifikasi pertama
                    if(empty($transaction->payment_method) || $transaction->payment_method === 'midtrans_unspecified') {
                        // only update if not set or set to placeholder
                    } else {
                        $updatePaymentMethod = false;
                    }
                    Log::info("Midtrans Webhook: Transaction {$transaction->id} is pending. Payment type: {$paymentType}.");
                } elseif ($transactionStatus == 'deny') {
                    $newStatus = 'failed'; // atau 'denied'
                    Log::info("Midtrans Webhook: Transaction {$transaction->id} denied. Payment type: {$paymentType}.");
                } elseif ($transactionStatus == 'expire') {
                    // Hanya update ke 'expired' jika status saat ini adalah 'pending'
                    if ($transaction->status == 'pending') {
                        $newStatus = 'expired'; // atau 'failed'
                    } else {
                        // Jika sudah 'paid' atau status final lain, jangan ubah ke 'expired'
                        $updatePaymentMethod = false; // Jangan update payment method jika tidak mengubah status utama
                        Log::info("Midtrans Webhook: Transaction {$transaction->id} received 'expire' notification but current status is '{$transaction->status}'. Status not changed.");
                    }
                    Log::info("Midtrans Webhook: Transaction {$transaction->id} expired. Payment type: {$paymentType}. Current DB status: {$transaction->status}");
                } elseif ($transactionStatus == 'cancel') {
                     // Hanya update ke 'canceled' jika status saat ini adalah 'pending' atau belum final
                    if (!in_array($transaction->status, ['paid', 'settlement'])) {
                        $newStatus = 'canceled';
                    } else {
                        $updatePaymentMethod = false;
                        Log::info("Midtrans Webhook: Transaction {$transaction->id} received 'cancel' notification but current status is '{$transaction->status}'. Status not changed.");
                    }
                    Log::info("Midtrans Webhook: Transaction {$transaction->id} canceled. Payment type: {$paymentType}. Current DB status: {$transaction->status}");
                }

                $transaction->status = $newStatus;
                if ($updatePaymentMethod && !empty($paymentType)) {
                    $transaction->payment_method = $paymentType; // Simpan jenis pembayaran aktual dari Midtrans
                }

                $transaction->save();
                DB::commit();
                 Log::info("Midtrans Webhook: Transaction {$transaction->id} successfully updated to status '{$newStatus}' and payment method '{$transaction->payment_method}'.");
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error("Midtrans Webhook: Failed to update transaction {$transaction->id}. Error: " . $e->getMessage(), ['exception' => $e]);
                return response()->json(['message' => 'Failed to update transaction status.'], 500);
            }

            return response()->json(['message' => 'Notification processed successfully.'], 200);

        } catch (\Exception $e) {
            Log::error('Midtrans notification handling error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_payload' => $request->all()
            ]);
            return response()->json(['message' => 'Error processing notification.'], 500);
        }
    }
}