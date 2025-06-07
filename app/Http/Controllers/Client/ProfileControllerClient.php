<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Address;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfileControllerClient extends Controller
{

    /**
     * Menampilkan halaman formulir profil pengguna.
     * Metode ini memuat pengguna yang terotentikasi beserta relasi kontak dan alamatnya.
     */
    public function show()
    {
        // Memuat relasi 'contacts.addresses' pada user yang sedang login
        $userWithRelations = Auth::user()->load(['contacts.addresses']);

        return Inertia::render('clients/ProfilePage', [
            'user' => new UserResource($userWithRelations),
            'contacts' => $userWithRelations->contacts ?? [],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Memperbarui informasi akun pengguna (username, email, password).
     */
    public function updateAccount(Request $request)
    {
        try {
            $user = Auth::user();

            $userValidated = $request->validate([
                'username' => [
                    'required', 'string', 'max:255',
                    Rule::unique('users', 'username')->ignore($user->id),
                ],
                'email' => [
                    'required', 'string', 'email', 'max:255',
                    Rule::unique('users', 'email')->ignore($user->id),
                ],
                'password' => 'nullable|string|min:8|confirmed',
            ]);

            $updateData = [
                'username' => $userValidated['username'],
                'email' => $userValidated['email'],
            ];

            if (!empty($userValidated['password'])) {
                $updateData['password'] = Hash::make($userValidated['password']);
            }

            $user->update($updateData);

            return redirect()->route('profile.show')->with('success', 'Informasi akun berhasil diperbarui.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Mengirim error ke 'updateAccount' error bag
            return back()->withErrors($e->errors(), 'updateAccount')->withInput();
        } catch (\Exception $e) {
            Log::error('Kesalahan pembaruan akun: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal memperbarui akun: ' . $e->getMessage());
        }
    }

    /**
     * Memperbarui informasi profil pengguna (kontak dan alamat).
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = Auth::user();

            // Validasi untuk data kontak dan alamat yang bersifat nested
            $contactsValidated = $request->validate([
                'contacts' => 'present|array',
                'contacts.*.id' => 'nullable|integer|exists:contacts,id',
                'contacts.*.name' => 'required|string|max:255',
                'contacts.*.phone' => 'required|string|max:20',
                'contacts.*.gender' => 'required|in:MAN,WOMAN',
                'contacts.*.birthday' => 'required|date',
                'contacts.*.profile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'contacts.*.profile_removed' => 'boolean',
                'contacts.*.addresses' => 'present|array',
                'contacts.*.addresses.*.id' => 'nullable|integer|exists:addresses,id',
                'contacts.*.addresses.*.post_code' => 'required|string|max:10',
                'contacts.*.addresses.*.country' => 'required|string|max:100',
                'contacts.*.addresses.*.province' => 'required|string|max:100',
                'contacts.*.addresses.*.city' => 'required|string|max:100',
                'contacts.*.addresses.*.street' => 'required|string|max:255',
                'contacts.*.addresses.*.more' => 'nullable|string|max:255',
            ]);

            DB::transaction(function () use ($user, $contactsValidated, $request) {
                // Kelola pembaruan kontak dan alamat
                $this->handleContactsUpdate($user, $contactsValidated['contacts'] ?? [], $request);
            });

            return redirect()->route('profile.show')->with('success', 'Kontak dan alamat berhasil diperbarui.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Mengirim error ke 'updateProfile' error bag
            return back()->withErrors($e->errors(), 'updateProfile')->withInput();
        } catch (\Exception $e) {
            Log::error('Kesalahan pembaruan profil: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal memperbarui profil: ' . $e->getMessage());
        }
    }

    /**
     * Mengelola operasi buat, perbarui, dan hapus untuk kontak.
     */
    private function handleContactsUpdate(User $user, array $contactsData, Request $request)
    {
        $existingContactIds = $user->contacts->pluck('id')->toArray();
        $submittedContactIds = [];

        foreach ($contactsData as $index => $contactData) {
            $contactId = $contactData['id'] ?? null;
            $submittedContactIds[] = $contactId;

            if ($contactId && in_array($contactId, $existingContactIds)) {
                // Update kontak yang sudah ada
                $contact = Contact::find($contactId);
                if ($contact) {
                    $this->updateExistingContact($contact, $contactData, $request, $index);
                }
            } else {
                // Buat kontak baru
                $this->createNewContact($user, $contactData, $request, $index);
            }
        }

        // Hapus kontak yang tidak lagi ada di data yang disubmit
        $contactsToDeleteIds = array_diff($existingContactIds, array_filter($submittedContactIds));
        if (!empty($contactsToDeleteIds)) {
            $contactsToDelete = Contact::whereIn('id', $contactsToDeleteIds)->get();
            foreach ($contactsToDelete as $contact) {
                if ($contact->profile && Storage::disk('public')->exists($contact->profile)) {
                    Storage::disk('public')->delete($contact->profile);
                }
                $contact->addresses()->delete();
                $contact->delete();
            }
        }
    }

    /**
     * Memperbarui data kontak yang sudah ada.
     */
    private function updateExistingContact(Contact $contact, array $contactData, Request $request, int $index)
    {
        $profilePath = $contact->profile;

        if (isset($contactData['profile_removed']) && $contactData['profile_removed']) {
            if ($profilePath && Storage::disk('public')->exists($profilePath)) {
                Storage::disk('public')->delete($profilePath);
            }
            $profilePath = null;
        }

        if ($request->hasFile("contacts.{$index}.profile")) {
            if ($profilePath && Storage::disk('public')->exists($profilePath)) {
                Storage::disk('public')->delete($profilePath);
            }
            $profilePath = $request->file("contacts.{$index}.profile")->store('contacts', 'public');
        }

        $contact->update([
            'name' => $contactData['name'],
            'phone' => $contactData['phone'],
            'gender' => $contactData['gender'],
            'birthday' => $contactData['birthday'],
            'profile' => $profilePath,
        ]);

        $this->handleAddressesUpdate($contact, $contactData['addresses'] ?? []);
    }

    /**
     * Membuat kontak baru.
     */
    private function createNewContact(User $user, array $contactData, Request $request, int $index)
    {
        $profilePath = null;
        if ($request->hasFile("contacts.{$index}.profile")) {
            $profilePath = $request->file("contacts.{$index}.profile")->store('contacts', 'public');
        }

        $contact = $user->contacts()->create([
            'name' => $contactData['name'],
            'phone' => $contactData['phone'],
            'gender' => $contactData['gender'],
            'birthday' => $contactData['birthday'],
            'profile' => $profilePath,
        ]);

        if (isset($contactData['addresses'])) {
            $this->handleAddressesUpdate($contact, $contactData['addresses']);
        }
        return $contact;
    }

    /**
     * Mengelola operasi buat, perbarui, dan hapus untuk alamat.
     */
    private function handleAddressesUpdate(Contact $contact, array $addressesData)
    {
        $existingAddressIds = $contact->addresses->pluck('id')->toArray();
        $submittedAddressIds = [];

        foreach ($addressesData as $addressData) {
            $addressId = $addressData['id'] ?? null;
            $submittedAddressIds[] = $addressId;

            if ($addressId && in_array($addressId, $existingAddressIds)) {
                Address::find($addressId)->update($addressData);
            } else {
                $contact->addresses()->create($addressData);
            }
        }

        $addressesToDelete = array_diff($existingAddressIds, array_filter($submittedAddressIds));
        if (!empty($addressesToDelete)) {
            Address::whereIn('id', $addressesToDelete)->delete();
        }
    }
}