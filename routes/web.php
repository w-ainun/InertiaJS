<?php

use App\Http\Controllers\Admin\AdminAddressController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminContactController;
use App\Http\Controllers\Admin\AdminItemController;
use App\Http\Controllers\Admin\AdminRatingController;
use App\Http\Controllers\Admin\AdminTransactionController;
use App\Http\Controllers\Admin\AdminTransactionDetailController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\Client\CartController;
use App\Http\Controllers\Client\ProfileControllerClient;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Models\Transaction;
use App\Models\User; // Ditambahkan untuk type-hinting jika diperlukan
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('landing page');

Route::get('/offers', function () {
    return Inertia::render('offers');
})->name('offers');

Route::get('/order', function () {
    return Inertia::render('order');
})->name('order');

Route::get('/Homepage', function () {
    return Inertia::render('Homepage');
})->name('Homepage');

Route::get('/Delivery', function () {
    return Inertia::render('Delivery');
})->name('Delivery');

Route::get('/menu', [CategoryController::class, 'index'])->name('client.menu.index');
Route::get('/menu/{slug}', [CategoryController::class, 'show'])->name('client.menu.category');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('admins/dashboard');
        })->name('dashboard');
        Route::resource('users', AdminUserController::class);
        Route::resource('contacts', AdminContactController::class);
        Route::resource('address', AdminAddressController::class);
        Route::resource('transactions', AdminTransactionController::class);
        Route::resource('categories', AdminCategoryController::class);
        Route::resource('items', AdminItemController::class);
        Route::resource('ratings', AdminRatingController::class);
        Route::resource('details', AdminTransactionDetailController::class);
    });

    Route::prefix('courier')->name('courier.')->group(function () {
        Route::get('/', function () {
            echo "Ini halaman kurir ya";
        })->name('dashboard');
    });

    Route::get('/profile', [ProfileControllerClient::class, 'show'])->name('profile.show');
    Route::post('/profile', [ProfileControllerClient::class, 'update'])->name('profile.update');
    Route::post('/profile/addresses', [ProfileControllerClient::class, 'storeAddressFromCart'])->name('profile.address.store');

    // Route Pesanan Saya yang sudah diperbarui
    Route::get('/pesanan-saya', function () {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Seharusnya tidak pernah null karena ada middleware 'auth', tapi sebagai penjagaan
        if (!$user) {
            return Inertia::render('PesananSaya', [
                'activeOrders' => [],
                'historicalOrders' => [],
            ]);
        }

        $activeStatuses = ['pending', 'paid', 'settlement', 'dikemas', 'dalam_pengiriman'];
        $historicalStatuses = ['selesai', 'diterima', 'canceled', 'failed', 'expired', 'deny'];

        $ordersQuery = Transaction::where('client_id', $user->id)
                            ->with([
                                'details.item:id,name',
                                'address:id,street,more,city,province,post_code,country'
                            ])
                            ->orderBy('created_at', 'desc');

        $activeOrders = (clone $ordersQuery)
                        ->whereIn('status', $activeStatuses)
                        ->get()
                        ->map(function ($transaction) {
                            $transaction->order_number_display = 'RB-' . $transaction->id . '-' . $transaction->created_at->timestamp;
                            return $transaction;
                        });

        $historicalOrders = (clone $ordersQuery)
                            ->whereIn('status', $historicalStatuses)
                            ->get()
                            ->map(function ($transaction) {
                                $transaction->order_number_display = 'RB-' . $transaction->id . '-' . $transaction->created_at->timestamp;
                                return $transaction;
                            });

        return Inertia::render('PesananSaya', [
            'activeOrders' => $activeOrders,
            'historicalOrders' => $historicalOrders,
        ]);
    })->name('pesanan-saya'); // Nama route tetap sama, middleware sudah dicakup oleh group

    Route::group(['as' => 'client.', 'prefix' => 'client'], function () {
        Route::get('/cart', [CartController::class, 'index'])->name('cart.index'); //
        Route::post('/cart/add', [CartController::class, 'addToCart'])->name('cart.add'); //
        Route::patch('/cart/update', [CartController::class, 'updateCart'])->name('cart.update'); //
        Route::delete('/cart/remove', [CartController::class, 'removeFromCart'])->name('cart.remove'); //
        Route::post('/cart/checkout', [CartController::class, 'checkout'])->name('cart.checkout'); //
        Route::get('/cart/data', [CartController::class, 'getCartData'])->name('cart.data'); //

        // RUTE BARU untuk inisiasi pembayaran
        Route::get('/payment/initiate/{transaction}', function (Transaction $transaction) { //
            if (Auth::id() !== $transaction->client_id) { //
                return redirect()->route('Homepage')->with('error', 'Anda tidak diizinkan untuk melakukan tindakan ini.'); //
            }
            return Inertia::render('Client/PaymentInitiatePage', [ //
                'transactionId' => $transaction->id, //
                'totalAmount' => $transaction->total, //
                'orderStatus' => $transaction->status, //
            ]);
        })->name('payment.initiate'); //

        Route::get('/orders/{transaction}', function (Transaction $transaction) { //
            if (Auth::id() !== $transaction->client_id) { //
                return redirect()->route('Homepage')->with('error', 'Anda tidak diizinkan untuk melihat pesanan ini.'); //
            }
            $transaction->loadMissing('details.item'); //
            return Inertia::render('Client/OrderConfirmation', [ //
                'transactionId' => $transaction->id, //
                'transaction' => $transaction, //
                'totalAmount' => $transaction->total, //
            ]);
        })->name('orders.show'); //
    });
});

if (file_exists(__DIR__ . '/settings.php')) {
    require __DIR__ . '/settings.php';
}
if (file_exists(__DIR__ . '/auth.php')) {
    require __DIR__ . '/auth.php';
}
