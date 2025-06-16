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
use App\Http\Controllers\Courier\CourierController;
use App\Http\Controllers\Client\ProfileControllerClient;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\Client\ClientOrderActionController;
use App\Http\Controllers\Client\RatingController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\MidtransNotificationController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Models\Transaction;

use Inertia\Inertia;
use App\Http\Controllers\HomeController;

Route::get('/', function () {
    return redirect('/Homepage');
});

// Route::get('/', [ItemController::class, 'index'])->name('homepage');
Route::get('/', [HomeController::class, 'index'])->name('home');

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
    Route::prefix('admin')->group(function () {
        Route::get('/', function () {
            return Inertia::render('admins/dashboard');
        })->name('dashboard');
        Route::resource('users', AdminUserController::class);
        Route::resource('contacts', AdminContactController::class);
        Route::resource('address', AdminAddressController::class);
        // Route::resource('feedbacks', AdminFeedbackController::class);
        Route::resource('transactions', AdminTransactionController::class);
        Route::resource('categories', AdminCategoryController::class);
        Route::resource('items', AdminItemController::class);
        Route::resource('ratings', AdminRatingController::class);
        Route::resource('details', AdminTransactionDetailController::class);
    });

    Route::prefix('client')->group(function () {
        Route::prefix('profile')->group(function () {
            Route::get('/', [ProfileControllerClient::class, 'index'])->name('client.profile.index');
            Route::put('/{id}/user', [ProfileControllerClient::class, 'updateUser'])->name('client.profile.user');
            Route::post('/{id}/contact', [ProfileControllerClient::class, 'storeContact'])->name('client.profile.contact');
            Route::post('/{id}/address', [ProfileControllerClient::class, 'storeAddress'])->name('client.profile.address');
        });
    });

    Route::prefix('courier')->name('courier.')->group(function () {
        Route::get('/', function () {
            echo "Ini halaman kurir ya";
        })->name('dashboard');
    });

    Route::middleware(['auth'])->group(function () {
        Route::get('/profile', [ProfileControllerClient::class, 'show'])->name('profile.show');
        
        // Rute untuk memperbarui informasi akun (tanpa file)
        Route::patch('/profile/account', [ProfileControllerClient::class, 'updateAccount'])->name('profile.account.update');
        
        // Rute untuk memperbarui profil (kontak & alamat, dengan file), menggunakan POST
        Route::post('/profile/profile', [ProfileControllerClient::class, 'updateProfile'])->name('profile.profile.update');
    });

    Route::get('/pesanan-saya', function () {
        $user = Auth::user();
        if (!$user) {
            return Inertia::render('PesananSaya', [
                'activeOrders' => [],
                'historicalOrders' => [],
            ]);
        }
        
        // Pesanan dianggap aktif jika statusnya belum 'selesai' atau status final negatif lainnya.
        // 'diterima' dan 'dalam_pengiriman' termasuk status aktif.
        $activeStatuses = ['pending', 'paid', 'settlement', 'dikemas', 'dalam_pengiriman', 'diterima'];
        $historicalStatuses = ['selesai', 'canceled', 'failed', 'expired', 'deny'];

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
    })->name('pesanan-saya');


    Route::middleware(['auth'])->prefix('client')->name('client.')->group(function () {
        Route::get('/cart', [CartController::class, 'index'])->name('cart.index'); //
        Route::post('/cart/add', [CartController::class, 'addToCart'])->name('cart.add'); //
        Route::patch('/cart/update', [CartController::class, 'updateCart'])->name('cart.update'); //
        Route::delete('/cart/remove', [CartController::class, 'removeFromCart'])->name('cart.remove'); //
        Route::post('/cart/checkout', [CartController::class, 'checkout'])->name('cart.checkout'); //
        Route::get('/cart/data', [CartController::class, 'getCartData'])->name('cart.data'); //

        Route::post('/cart/validate-voucher', [CartController::class, 'validateVoucher'])->name('cart.validateVoucher'); //
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

        Route::get('/orders/{transaction}/receipt', [ClientOrderActionController::class, 'showReceipt'])->name('orders.receipt'); //
        Route::post('/orders/{transaction}/mark-received', [ClientOrderActionController::class, 'markAsReceived'])->name('orders.markReceived'); //

        // Favorite routes
        Route::post('/favorites/toggle', [FavoriteController::class, 'toggle'])
            ->name('favorites.toggle');
    });

    Route::prefix('courier')->group(function () {
        Route::get('/', [CourierController::class, 'index'])->name('courier.beranda');
        Route::patch('/update/{id}', [CourierController::class, 'update'])->name('courier.update');
});
 Route::middleware(['auth'])->group(function () { //
    Route::post('/client/reviews', [RatingController::class, 'store'])->name('client.reviews.store');
    Route::post('/ratings', [RatingController::class, 'store'])->name('ratings.store'); 
});

Route::post('/midtrans/webhook', [MidtransNotificationController::class, 'handle']);
Route::get('/orders/{transaction}/status', [OrderController::class, 'checkStatus'])->name('client.orders.checkStatus');
});
if (file_exists(__DIR__ . '/settings.php')) {
    require __DIR__ . '/settings.php';
}
if (file_exists(__DIR__ . '/auth.php')) {
    require __DIR__ . '/auth.php';
}