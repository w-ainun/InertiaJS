<?php

// autoload and namespace in composer

use App\Http\Controllers\AddressController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TransactionDetailController;
use App\Http\Controllers\UserController;
use App\Models\Category;
use App\Models\Feedback;
use App\Models\Item;
use App\Models\Rating;
use App\Models\Transaction;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function() { // routes
    return Inertia::render('home'); // file name
})->name('home'); // name for pages

Route::get('/menu', function() {
    return Inertia::render('menu');
})->name('menu');

Route::get('/offers', function() {
    return Inertia::render('offers');
});

Route::get('/order', function() {
    return Inertia::render('order');
});

Route::resource('users', UserController::class);
Route::resource('contacts', ContactController::class);
Route::resource('address', AddressController::class);
Route::resource('feedbacks', FeedbackController::class);
Route::resource('transactions', TransactionController::class);
Route::resource('categories', CategoryController::class);
Route::resource('items', ItemController::class);
Route::resource('ratings', RatingController::class);
Route::resource('details', TransactionDetailController::class);

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
