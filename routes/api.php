<?php

// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MidtransNotificationController; // Pastikan namespace ini benar

// ... (route API Anda yang lain)
Route::post('/midtrans/webhook', [MidtransNotificationController::class, 'handle']);