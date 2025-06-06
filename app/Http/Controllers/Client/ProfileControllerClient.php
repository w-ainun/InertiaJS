<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\client\UserProfileResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\Address;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException; 

class ProfileControllerClient extends Controller {
    public function show() {
        $auth = Auth::user();
        $user = User::where('id', $auth->id)->with('contacts.addresses')->get();

        return Inertia::render('clients/ProfilePage', [
            'user' => UserResource::collection($user),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function update(Request $request)
    {
        $userId = Auth::id();

        try {
            $user = Auth::user();

            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users,username,' . $user->id,
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
                'password' => ['nullable', 'string', 'confirmed', Password::defaults()],
                'contacts' => 'nullable|array',
                'contacts.*.id' => 'nullable|integer|exists:contacts,id,user_id,' . $user->id,
                'contacts.*.name' => 'required_with:contacts|string|max:100',
                'contacts.*.phone' => 'required_with:contacts|string|max:20',
                'contacts.*.gender' => 'required_with:contacts|in:MAN,WOMAN',
                'contacts.*.birthday' => 'required_with:contacts|date',
                'contacts.*.profile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'contacts.*.profile_removed' => 'nullable|boolean',
                'contacts.*.addresses' => 'nullable|array',
                'contacts.*.addresses.*.id' => 'nullable|integer|exists:addresses,id',
                'contacts.*.addresses.*.post_code' => 'required_with:contacts.*.addresses|string|max:10',
                'contacts.*.addresses.*.country' => 'required_with:contacts.*.addresses|string|max:100',
                'contacts.*.addresses.*.province' => 'required_with:contacts.*.addresses|string|max:100',
                'contacts.*.addresses.*.city' => 'required_with:contacts.*.addresses|string|max:100',
                'contacts.*.addresses.*.street' => 'required_with:contacts.*.addresses|string|max:200',
                'contacts.*.addresses.*.more' => 'nullable|string|max:50',
            ]);

            if (isset($validatedData['contacts'])) {
                if (empty($validatedData['contacts'])) {
                    Log::warning('[PROFILE UPDATE] "contacts" data in validated input is AN EMPTY ARRAY.', ['user_id' => $userId]);
                }
            } else {
                Log::warning('[PROFILE UPDATE] "contacts" key is NOT SET or NOT AN ARRAY in validated data.', ['user_id' => $userId]);
            }

            $userData = [
                'name' => $validatedData['name'],
                'username' => $validatedData['username'],
                'email' => $validatedData['email'],
            ];
            if (!empty($validatedData['password'])) {
                $userData['password'] = Hash::make($validatedData['password']);
            }

            if (!$user->update($userData)) {
                Log::error('[PROFILE UPDATE] Failed to update user data.', ['user_id' => $user->id]);
                DB::rollBack();
                return redirect()->back()->withErrors(['error' => 'Gagal memperbarui data pengguna.'])->withInput();
            }
            Log::info('[PROFILE UPDATE] User data updated successfully.', ['user_id' => $user->id]);

            $currentContactIdsInDb = $user->contacts()->pluck('id')->toArray();
            $processedContactIds = [];

            if (isset($validatedData['contacts']) && is_array($validatedData['contacts']) && !empty($validatedData['contacts'])) {
                Log::info('[PROFILE UPDATE] Processing ' . count($validatedData['contacts']) . ' contact item(s).', ['user_id' => $userId]);
                
                foreach ($validatedData['contacts'] as $contactInput) {
                    if (!is_array($contactInput)) {
                        Log::warning("[PROFILE UPDATE] Skipping contact item because it's not an array after validation.", ['user_id' => $userId]);
                        continue;
                    }

                    $contactData = array_map(fn($value) => is_string($value) ? trim($value) : $value, $contactInput);
                    $contactInstance = null;
                    $currentProfilePath = null;

                    if (!empty($contactData['id'])) {
                        $contactInstance = Contact::find($contactData['id']);
                        if (!$contactInstance) {
                            Log::warning('[PROFILE UPDATE] Contact ID submitted but not found, skipping update.', ['contact_id' => $contactData['id'], 'user_id' => $userId]);
                            continue;
                        }
                        $currentProfilePath = $contactInstance->profile;
                    }

                    $newProfilePath = $currentProfilePath;
                    if (isset($contactData['profile']) && $contactData['profile'] instanceof UploadedFile) {
                        if ($currentProfilePath && Storage::disk('public')->exists($currentProfilePath)) {
                            Storage::disk('public')->delete($currentProfilePath);
                        }
                        $newProfilePath = $contactData['profile']->store('profiles', 'public');
                        Log::info('[PROFILE UPDATE] New profile uploaded for contact.', ['user_id' => $userId, 'contact_id_ref' => $contactInstance->id ?? 'new', 'path' => $newProfilePath]);
                    } elseif (isset($contactData['profile_removed']) && $contactData['profile_removed'] === true) {
                        if ($currentProfilePath && Storage::disk('public')->exists($currentProfilePath)) {
                            Storage::disk('public')->delete($currentProfilePath);
                        }
                        $newProfilePath = null;
                        Log::info('[PROFILE UPDATE] Profile removed for contact as requested.', ['user_id' => $userId, 'contact_id_ref' => $contactInstance->id ?? 'new']);
                    }

                    $contactFieldsForSave = [
                        'name' => $contactData['name'] ?? null,
                        'phone' => $contactData['phone'] ?? null,
                        'gender' => $contactData['gender'] ?? null,
                        'birthday' => $contactData['birthday'] ?? null,
                        'profile' => $newProfilePath,
                    ];
                    
                    if ($contactInstance) {
                        if (empty(array_filter($contactFieldsForSave, fn($k) => $k !== 'profile', ARRAY_FILTER_USE_KEY)) && $contactFieldsForSave['profile'] === $currentProfilePath) {
                            Log::info('[PROFILE UPDATE] No actual data changes for existing contact, skipping DB update.', ['contact_id' => $contactInstance->id, 'user_id' => $userId]);
                        } else if (!$contactInstance->update($contactFieldsForSave)) {
                            Log::error('[PROFILE UPDATE] Failed to update contact.', ['contact_id' => $contactInstance->id, 'user_id' => $userId]);
                            continue; 
                        } else {
                            Log::info('[PROFILE UPDATE] Contact updated.', ['contact_id' => $contactInstance->id, 'user_id' => $userId]);
                        }
                    } else {
                        if (empty($contactData['name']) || empty($contactData['phone']) || empty($contactData['gender']) || empty($contactData['birthday'])) {
                            Log::warning('[PROFILE UPDATE] Skipping creation of new contact due to missing required fields after validation.', ['user_id' => $userId, 'provided_name' => $contactData['name'] ?? 'N/A']);
                            continue;
                        }
                        $contactFieldsForSave['user_id'] = $user->id;
                        $contactInstance = Contact::create($contactFieldsForSave);
                        if (!$contactInstance) {
                            Log::error('[PROFILE UPDATE] Failed to create contact.', ['user_id' => $userId, 'provided_name' => $contactData['name'] ?? 'N/A']);
                            continue;
                        }
                        Log::info('[PROFILE UPDATE] Contact created.', ['contact_id' => $contactInstance->id, 'user_id' => $userId]);
                    }
                    $processedContactIds[] = $contactInstance->id;

                    $currentAddressIdsInDbForContact = $contactInstance->addresses()->pluck('id')->toArray();
                    $processedAddressIdsForContact = [];
                    
                    if (isset($contactData['addresses']) && is_array($contactData['addresses'])) {
                        Log::info('[PROFILE UPDATE] Processing ' . count($contactData['addresses']) . ' addresses for contact.', ['contact_id' => $contactInstance->id, 'user_id' => $userId]);
                        
                        foreach ($contactData['addresses'] as $addressInput) {
                            if (!is_array($addressInput)) {
                                Log::warning("[PROFILE UPDATE] Skipping address item because it's not an array.", ['contact_id' => $contactInstance->id, 'user_id' => $userId]);
                                continue;
                            }
                            $addressData = array_map(fn($value) => is_string($value) ? trim($value) : $value, $addressInput);
                            
                            $addressPayload = [
                                'post_code' => $addressData['post_code'] ?? '',
                                'country' => $addressData['country'] ?? '',
                                'province' => $addressData['province'] ?? '',
                                'city' => $addressData['city'] ?? '',
                                'street' => $addressData['street'] ?? '',
                                'more' => $addressData['more'] ?? null,
                            ];

                            if (empty($addressData['id']) && !array_filter(array_intersect_key($addressPayload, array_flip(['post_code', 'country', 'province', 'city', 'street'])))) {
                                continue;
                            }

                            if (!empty($addressData['id'])) {
                                $address = Address::where('id', $addressData['id'])
                                    ->where('contact_id', $contactInstance->id)
                                    ->first();
                                
                                if ($address) {
                                    if (!$address->update($addressPayload)) {
                                        Log::error('[PROFILE UPDATE] Failed to update address.', ['address_id' => $address->id, 'contact_id' => $contactInstance->id]);
                                        continue;
                                    }
                                    Log::info('[PROFILE UPDATE] Address updated.', ['address_id' => $address->id]);
                                    $processedAddressIdsForContact[] = $address->id;
                                } else {
                                    Log::warning('[PROFILE UPDATE] Address to update not found or not owned by contact.', ['submitted_address_id' => $addressData['id'], 'contact_id' => $contactInstance->id]);
                                }
                            } else {
                                if (empty($addressPayload['post_code']) || empty($addressPayload['country']) || empty($addressPayload['province']) || empty($addressPayload['city']) || empty($addressPayload['street'])) {
                                    Log::warning('[PROFILE UPDATE] Skipping creation of new address due to missing required fields.', ['contact_id' => $contactInstance->id]);
                                    continue;
                                }
                                $addressPayload['contact_id'] = $contactInstance->id;
                                $newAddress = Address::create($addressPayload);
                                if (!$newAddress) {
                                    Log::error('[PROFILE UPDATE] Failed to create address.', ['contact_id' => $contactInstance->id]);
                                    continue;
                                }
                                Log::info('[PROFILE UPDATE] Address created.', ['address_id' => $newAddress->id]);
                                $processedAddressIdsForContact[] = $newAddress->id;
                            }
                        }
                    } else {
                    }

                    $addressIdsToDelete = array_diff($currentAddressIdsInDbForContact, $processedAddressIdsForContact);
                    if (!empty($addressIdsToDelete)) {
                        Address::whereIn('id', $addressIdsToDelete)
                            ->where('contact_id', $contactInstance->id)
                            ->delete();
                        Log::info('[PROFILE UPDATE] Deleted addresses for contact.', ['contact_id' => $contactInstance->id, 'deleted_ids_count' => count($addressIdsToDelete)]);
                    }
                }
            } else {
                Log::info('[PROFILE UPDATE] No "contacts" array in validated data or it was empty.', ['user_id' => $userId]);
                if (!array_key_exists('contacts', $validatedData) && !array_key_exists('contacts', $request->all())) {
                    Log::warning('[PROFILE UPDATE] Key "contacts" was not present in request. Assuming no changes to existing contacts.', ['user_id' => $userId]);
                    $processedContactIds = $currentContactIdsInDb;
                } else {
                    Log::info('[PROFILE UPDATE] "contacts" key was present but resulted in an empty list. Existing contacts will be deleted if not matched.', ['user_id' => $userId]);
                }
            }

            $contactIdsToDelete = array_diff($currentContactIdsInDb, $processedContactIds);
            if (!empty($contactIdsToDelete)) {
                Log::info('[PROFILE UPDATE] Preparing to delete contacts for user.', ['user_id' => $user->id, 'contact_ids_to_delete_count' => count($contactIdsToDelete)]);
                $contactsFoundForDeletion = Contact::whereIn('id', $contactIdsToDelete)
                    ->where('user_id', $user->id)
                    ->get();
                
                foreach ($contactsFoundForDeletion as $contactToDelete) {
                    Log::info('[PROFILE UPDATE] Deleting contact and its resources.', ['contact_id' => $contactToDelete->id]);
                    $contactToDelete->addresses()->delete();

                    if ($contactToDelete->profile && Storage::disk('public')->exists($contactToDelete->profile)) {
                        Storage::disk('public')->delete($contactToDelete->profile);
                    }
                    $contactToDelete->delete();
                    Log::info('[PROFILE UPDATE] Contact deleted successfully.', ['contact_id' => $contactToDelete->id]);
                }
            }

            DB::commit();
            Log::info("[PROFILE UPDATE] Profile update transaction committed successfully for user: {$user->id}");
            
            return redirect()->route('profile.show')->with('success', 'Profil berhasil diperbarui!');

        } catch (ValidationException $e) {
            DB::rollBack();
            Log::error('[PROFILE UPDATE] Profile update VALIDATION FAILED.', ['user_id' => $userId, 'errors' => $e->errors()]);
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::critical('[PROFILE UPDATE] Profile update FAILED WITH GENERAL EXCEPTION.', [
                'user_id' => $userId, 
                'error_message' => $e->getMessage(), 
                'file' => $e->getFile(), 
                'line' => $e->getLine(),
            ]);
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan sistem. Mohon coba lagi nanti.'])->withInput();
        }
    }

    public function storeAddressFromCart(Request $request)
    {
        $user = Auth::user();
        Log::info('[CART ADDRESS STORE] Initiated by user: ' . $user->id);

        $defaultContactName = $user->username;
        $defaultContactDataForCreate = [
            'user_id' => $user->id,
            'name' => $defaultContactName,
            'phone' => $request->input('contact_phone', ''),
            'gender' => $request->input('contact_gender', 'MAN'),
            'birthday' => $request->input('contact_birthday', now()->format('Y-m-d'))
        ];
        
        try {
            $contact = Contact::firstOrCreate(
                ['name' => $defaultContactName, 'user_id' => $user->id], 
                $defaultContactDataForCreate
            );

            Log::info('[CART ADDRESS STORE] Default contact prepared.', ['contact_id' => $contact->id, 'user_id' => $user->id]);

            $validatedAddressData = $request->validate([
                'post_code' => 'required|string|max:10',
                'country' => 'required|string|max:100',
                'province' => 'required|string|max:100',
                'city' => 'required|string|max:100',
                'street' => 'required|string|max:200',
                'more' => 'nullable|string|max:50',
            ]);

            $validatedAddressData['contact_id'] = $contact->id;
            
            $address = Address::create($validatedAddressData);

            Log::info('[CART ADDRESS STORE] Address created from cart.', ['address_id' => $address->id, 'contact_id' => $contact->id]);

            return response()->json([
                'message' => 'Alamat berhasil ditambahkan!',
                'address' => [
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
            ], 201);

        } catch (ValidationException $e) {
            Log::error('[CART ADDRESS STORE] Validation failed.', ['user_id' => $user->id, 'errors' => $e->errors()]);
            return response()->json(['message' => 'Data tidak valid.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::critical('[CART ADDRESS STORE] Failed to store address from cart.', [
                'user_id' => $user->id,
                'error_message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json(['message' => 'Gagal menyimpan alamat karena kesalahan sistem.'], 500);
        }
    }
}