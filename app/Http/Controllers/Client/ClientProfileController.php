<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\Address;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ClientProfileController extends Controller {
  public function index () {
    $auth = Auth::user();
    $user = User::where('id', $auth->id)->with('contacts.addresses')->get();

    return Inertia::render('clients/profile', [
      'user' => UserResource::collection($user),
      'success' => session('success'),
      'error' => session('error'),
    ]);
  }

  public function updateUser(UpdateUserRequest $request, User $user) {
    try {
      $validated = $request->validated();
      $user->update($validated);
      return redirect()->route('client.profile.index')->with('success', 'User updated successfully.');
    } catch (\Exception $e) {
      Log::error($e->getMessage());

      return redirect()->back()->with('error', 'Failed to update user.');
    }
  }

  public function storeContact(StoreContactRequest $request) {
    try {
      $validated = $request->validated();

      if ($request->hasFile('profile')) {
        $profileUrl = $request->file('profile')->store('contacts', 'public');
        $validated['profile'] = $profileUrl;
      }

      Contact::create($validated);
      return redirect()->route('client.profile.index')->with('success', 'Contact created successfully.');
    } catch (\Exception $e) {
      Log::error($e->getMessage());

      return redirect()->back()->with('error', 'Failed to create Contact.');
    }
  }

  public function storeAddress(StoreAddressRequest $request) {
    try {
      Address::create($request->validated());

      return redirect()->route('address.index')->with('success', 'Address created successfully.');
    } catch (\Exception $e) {
      Log::error($e->getMessage());

      return redirect()->back()->with('error', 'Failed to create Contact.');
    }
  }
}
