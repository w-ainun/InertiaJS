<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Address;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CompleteProfileController extends Controller
{
    /**
     * Show the complete profile page.
     */
    public function create(): Response
     {
        return Inertia::render('auth/complete-profile');
    }

    /**
     * Handle an incoming profile completion request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'gender' => 'required|in:MAN,WOMAN',
            'birthday' => 'required|date',
            // Validate address fields
            'post_code' => 'required|string|max:10',
            'country' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'street' => 'required|string|max:200',
            'more' => 'nullable|string|max:50',
        ]);

        // Use database transaction to ensure both contact and address are created together
        DB::beginTransaction();
        
        try {
            // Create contact
            $contact = Contact::create([
                'client_id' => Auth::id(),
                'name' => $request->name,
                'phone' => $request->phone,
                'gender' => $request->gender,
                'birthday' => $request->birthday,
            ]);
            
            // Create address linked to the contact
            Address::create([
                'contact_id' => $contact->id,
                'post_code' => $request->post_code,
                'country' => $request->country,
                'province' => $request->province,
                'city' => $request->city,
                'street' => $request->street,
                'more' => $request->more,
            ]);
            
            DB::commit();
            
            return to_route('dashboard');
        } catch (\Exception $e) {
            DB::rollBack();
            
            // You may want to log the error here
            
            return back()->withErrors([
                'error' => 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.'
            ]);
        }
    }
}