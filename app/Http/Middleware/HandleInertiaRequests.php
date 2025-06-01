<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy; // Jika Anda menggunakan Ziggy untuk rute

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // [$message, $author] = str(Inspiring::quotes()->random())->explode('-'); // Bagian quote bisa dipertahankan jika mau

        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            // 'quote' => ['message' => trim($message), 'author' => trim($author)], // Opsional
            'auth' => [
                'user' => $request->user() ? [ // Kirim hanya data user yang relevan
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    // Tambahkan field lain jika perlu, misal role, dll.
                ] : null,
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            // --- TAMBAHKAN BAGIAN INI UNTUK FLASH MESSAGES DAN MIDTRANS KEY ---
            'flash' => function () use ($request) {
                return [
                    'success' => $request->session()->get('success'),
                    'error' => $request->session()->get('error'),
                    'info' => $request->session()->get('info'),
                    'success_payment_initiation' => $request->session()->get('success_payment_initiation'),
                    'snap_token' => $request->session()->get('snap_token'), // Ini yang paling penting untuk alur pembayaran
                    'snap_token_retry' => $request->session()->get('snap_token_retry'), // Jika Anda implementasi tombol coba bayar lagi
                ];
            },
            'midtrans_client_key' => config('midtrans.client_key'), // Bagikan juga Midtrans Client Key
            // --- AKHIR BAGIAN TAMBAHAN ---
        ]);
    }
}