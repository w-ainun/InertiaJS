<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\Address;
use App\Models\Contact;

class ProfileControllerClient extends Controller {
    public function show() {
        $user = Auth::user();
        // Eager load contact and its plural addresses
        $user->load('contact.addresses');

        $contact = $user->contact;
        // Pass the collection of addresses
 
        $addresses = $contact ? $contact->addresses : collect();

        return Inertia::render('clients/ProfilePage', [ // Filename adjusted to ProfilePage
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
            ],
            'contact' => $contact ? [
                'id' => $contact->id,

                // The 'name' field for contact will be the username
                'name' => $contact->name, // This 'name' in the contact model should store the username
                'phone' => $contact->phone,
                'gender' => $contact->gender,
                'birthday' => $contact->birthday,
                'profile' => $contact->profile,
            ] : null,
            'addresses' => $addresses->map(function ($address) { // Map to array for frontend
                return [
                    'id' => $address->id,
                    'post_code' => $address->post_code,
                    'country' => $address->country,
                    'province' => $address->province,
                    'city' => $address->city,
                    'street' => $address->street,
                    'more' => $address->more,
                    'summary' => trim(implode(', ', array_filter([
                        $address->street, $address->more, $address->city, $address->province, $address->post_code, $address->country
                    ]))),
                ];
            })->all(), // Convert collection to plain array
        ]);
    }

    public function update(Request $request) {
        $user = Auth::user();

        // Validate user and contact data
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'phone' => 'nullable|string|max:20',
            'gender' => 'nullable|in:MAN,WOMAN',
            'birthday' => 'nullable|date',
            'profile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'addresses' => 'nullable|array',
            'addresses.*.id' => 'nullable|integer|exists:addresses,id',
            'addresses.*.post_code' => 'nullable|string|max:10',
            'addresses.*.country' => 'nullable|string|max:100',
            'addresses.*.province' => 'nullable|string|max:100',
            'addresses.*.city' => 'nullable|string|max:100',
            'addresses.*.street' => 'nullable|string|max:200',
            'addresses.*.more' => 'nullable|string|max:50',
        ]);

        // Update user data
        $userData = [
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
        ];
        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }

        $user->update($userData);
        $user->refresh(); // Refresh user model to get updated username immediately
        $contact = $user->contact;
        $profilePath = $contact ? $contact->profile : null;

        if ($request->hasFile('profile')) {
            if ($profilePath && Storage::disk('public')->exists($profilePath)) {
                Storage::disk('public')->delete($profilePath);
            }
            $profilePath = $request->file('profile')->store('profiles', 'public');
        } elseif ($request->boolean('profile_removed')) {
            if ($profilePath && Storage::disk('public')->exists($profilePath)) {
                Storage::disk('public')->delete($profilePath);
            }
            $profilePath = null;
        }

        $contactData = [
            'user_id' => $user->id,
            'name' => $request->name ?? $user->username,
            'phone' => $request->phone ?? ($contact->phone ?? ''),
            'gender' => $request->gender ?? ($contact->gender ?? 'MAN'),
            'birthday' => $request->birthday ?? ($contact->birthday ?? now()->format('Y-m-d')),
        ];

        if ($request->hasFile('profile') || $request->boolean('profile_removed')) {
            $contactData['profile'] = $profilePath;
        }

        if ($contact) {
            $contact->update($contactData);
        } else {
            if(!isset($contactData['profile']) && $profilePath) $contactData['profile'] = $profilePath;
            $contact = $user->contact()->create($contactData);
        }

        // --- Handle Multiple Addresses ---

        if ($contact) {
            $currentAddressIds = $contact->addresses->pluck('id')->toArray();
            $submittedAddressIds = [];
            if ($request->has('addresses') && is_array($request->addresses)) {
                foreach ($request->addresses as $addressData) {
                    $addressData = array_map(fn($value) => is_string($value) ? trim($value) : $value, $addressData);
                    $meaningfulFields = array_filter($addressData, fn($value, $key) => $key !== 'id' && !empty($value), ARRAY_FILTER_USE_BOTH);
                    if (!empty($meaningfulFields)) {
                         if (empty($addressData['street']) || empty($addressData['city']) || empty($addressData['province']) || empty($addressData['post_code']) || empty($addressData['country'])) {
                            continue;
                        }
                        if (isset($addressData['id']) && $addressData['id']) {
                            $address = Address::find($addressData['id']);
                            if ($address && $address->contact_id === $contact->id) {
                                $address->update($addressData);
                                $submittedAddressIds[] = $address->id;
                            }
                        } else {
                            $newAddress = $contact->addresses()->create($addressData);
                            $submittedAddressIds[] = $newAddress->id;
                        }
                    }
                }
            }
            $addressesToDelete = array_diff($currentAddressIds, $submittedAddressIds);
            if (!empty($addressesToDelete)) {
                Address::whereIn('id', $addressesToDelete)->where('contact_id', $contact->id)->delete();
            }
        }
        return redirect()->back()->with('success', 'Profile updated successfully!');
    }

    public function storeAddressFromCart(Request $request) {
        $user = Auth::user();
        // Ensure contact exists or create one
        // The contact's 'name' will be the user's username.
        $contact = $user->contact()->firstOrCreate(
            ['user_id' => $user->id],        // Search criteria
            ['name' => $user->username]      // Values if creating. Use username for contact's name.
        );

        $validatedData = $request->validate([
            'post_code' => 'required|string|max:10',
            'country' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'street' => 'required|string|max:200',
            'more' => 'nullable|string|max:50',
        ]);

        $address = $contact->addresses()->create($validatedData);

        return response()->json([
            'message' => 'Address added successfully!',
            'address' => [ // Return a structure similar to what Cart.tsx expects
                'id' => $address->id,
                'post_code' => $address->post_code,
                'country' => $address->country,
                'province' => $address->province,
                'city' => $address->city,
                'street' => $address->street,
                'more' => $address->more,
                'summary' => trim(implode(', ', array_filter([
                    $address->street, $address->more, $address->city,
                    $address->province, $address->post_code, $address->country
                ]))),
            ]
        ], 201); // 201 Created status
    }
}