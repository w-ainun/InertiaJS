<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () { // routes
    return Inertia::render('home'); // file name
})->name('home'); // name for pages

Route::get('/about', function() {
    return Inertia::render('about', [
        'name' => 'JOJO'
    ]);
})->name('about');

Route::get('/blog', function() {
    return Inertia::render('blog');
})->name('blog');

Route::get('/contact', function() {
    return Inertia::render('contact', [
        'email' => 'achmadaliridho46@gmail.com',
        'sosmed' => 'rhindottire'
    ]);
})->name('contact');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
