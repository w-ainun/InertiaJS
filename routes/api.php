<?php

// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MidtransNotificationController; // Pastikan namespace ini benar

// ... (route API Anda yang lain)

Route::post('/midtrans/notification', [MidtransNotificationController::class, 'handle'])
    ->name('midtrans.notification');