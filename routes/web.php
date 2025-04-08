<?php

// autoload and namespace in composer
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

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
