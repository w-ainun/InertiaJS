<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Contact;  // Pastikan path ke model Anda benar
use App\Models\Address;  // Pastikan path ke model Anda benar
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class CompleteProfileController extends Controller
{
    /**
     * Show the complete profile page.
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('auth/complete-profile'); // Pastikan path 'auth/complete-profile' sesuai
    }

    /**
     * Handle an incoming profile completion request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'gender' => 'required|in:MAN,WOMAN',
            'birthday' => 'required|date',
            'post_code' => 'required|string|max:10',
            'country' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'street' => 'required|string|max:200',
            'more' => 'nullable|string|max:50',
        ]);

        DB::beginTransaction();
        
        try {
            $contact = Contact::create([
                'user_id' => Auth::id(), // Menggunakan user_id sesuai migrasi
                'name' => $validatedData['name'],
                'phone' => $validatedData['phone'],
                'gender' => $validatedData['gender'],
                'birthday' => $validatedData['birthday'],
            ]);
            
            Address::create([ // Menggunakan $address = Address::create(...) jika Anda perlu menggunakan $address setelah ini
                'contact_id' => $contact->id,
                'post_code' => $validatedData['post_code'],
                'country' => $validatedData['country'],
                'province' => $validatedData['province'],
                'city' => $validatedData['city'],
                'street' => $validatedData['street'],
                'more' => $validatedData['more'],
            ]);

            DB::commit();
            
            return to_route('Homepage'); 

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'error' => 'Terjadi kesalahan saat menyimpan profil Anda. Silakan coba lagi nanti.' . (config('app.debug') ? ' Pesan: ' . $e->getMessage() : '') // Tampilkan pesan detail jika debug mode aktif
            ])->withInput(); // Mengembalikan input sebelumnya agar form tidak kosong
        }
    }
}