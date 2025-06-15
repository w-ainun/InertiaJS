<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    protected $except = [
    '/midtrans/webhook/handle', // Tambahkan route Midtrans webhook ke dalam pengecualian CSRF
    '/api/*', // Tambahkan semua route API ke dalam pengecualian CSRF
];


}
