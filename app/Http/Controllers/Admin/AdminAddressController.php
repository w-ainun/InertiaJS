<?php

namespace App\Http\Controllers\Admin;

use App\Models\Address;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Http\Resources\AddressResource;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminAddressController extends Controller {
    public function index() {
        $address = Address::all();

        return Inertia::render('admins/address/index', [
            'address' => AddressResource::collection($address),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function create() {
        //
    }

    public function store(StoreAddressRequest $request) {
        try {
            Address::create($request);

            return redirect()->route('address.index')->with('success', 'Address created successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to create Contact.');
        }
    }

    public function show(Address $address) {
        //
    }

    public function edit(Address $address) {
        return Inertia::render('admins/address/edit', [
            'address' => new AddressResource($address),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function update(UpdateAddressRequest $request, Address $address) {
        //
    }

    public function destroy(Address $address) {
        //
    }
}