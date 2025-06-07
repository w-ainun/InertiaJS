<?php

namespace App\Http\Controllers\Admin;

use App\Models\Address;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Http\Resources\AddressResource;
use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminAddressController extends Controller {
    public function index() {
        $address = Address::withTrashed()->with('contact.user')->get();

        return Inertia::render('admins/address/index', [
            'address' => AddressResource::collection($address),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function create() {
        $contacts = Contact::withTrashed()->with('user')->get();

        return Inertia::render('admins/address/create', [
            'contacts' => ContactResource::collection($contacts),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function store(StoreAddressRequest $request) {
        try {
            Address::create($request->validated());

            return redirect()->route('address.index')->with('success', 'Address created successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to create Contact.');
        }
    }

    public function show($id) {
        $address = Address::withTrashed()->with('contact.user')->findOrFail($id);

        return Inertia::render('admins/address/show', [
            'address' => new AddressResource($address),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function edit(Address $address) {
        $address->load('contact.user');

        return Inertia::render('admins/address/edit', [
            'address' => new AddressResource($address),
            // 'users' => User::select('id', 'username')->get(),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function update(UpdateAddressRequest $request, Address $address) {
        try {
            $validated = $request->validated();

            if ($request->hasFile('profile')) {
                $path = $request->file('profile')->store('profiles', 'public');
                $validated['profile'] = $path;
            }
            $address->update($validated);

            return redirect()->route('address.index')->with('success', 'Address updated successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->with('error', 'Failed to update Address.');
        }
    }

    public function destroy(Address $address) {
        try {
            $address->delete();

            return redirect()->back()->with('success', 'Address deleted successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to delete address.');
        }
    }

    public function restore($id) {
        try {
            $address = Address::withTrashed()->findOrFail($id);
            $address->restore();

            return redirect()->back()->with('success', 'Address restored successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to restore address.');
        }
    }
}