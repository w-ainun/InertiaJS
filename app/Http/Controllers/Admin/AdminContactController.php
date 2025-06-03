<?php

namespace App\Http\Controllers\Admin;

use App\Models\Contact;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use App\Http\Resources\ContactResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminContactController extends Controller {
    public function index() {
        $contacts = Contact::withTrashed()->with('user')->get();

        return Inertia::render('admins/contacts/index', [
            'contacts' => ContactResource::collection($contacts),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function create() {
        $users = User::withTrashed()->get();

        return Inertia::render('admins/contacts/create', [
            'users' => UserResource::collection($users),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function store(StoreContactRequest $request) {
        try {
            $validated = $request->validated();

            if ($request->hasFile('profile')) {
                $profileUrl = $request->file('profile')->store('contacts', 'public');
                $validated['profile'] = $profileUrl;
            }

            Contact::create($validated);
            return redirect()->route('contacts.index')->with('success', 'Contact created successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to create Contact.');
        }
    }

    public function show($id) {
        $contact = Contact::withTrashed()->with('user')->findOrFail($id);

        return Inertia::render('admins/contacts/show', [
            'contacts' => new ContactResource($contact),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function edit(Contact $contact) {
        $contact->load('user'); // Eager load relasi 'user'
        return Inertia::render('admins/contacts/edit', [
            'contacts' => new ContactResource($contact),
            'users' => User::select('id', 'username')->get(),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function update(UpdateContactRequest $request, Contact $contact) {
        try {
            $validated = $request->validated();

            if ($request->hasFile('profile')) {
                $path = $request->file('profile')->store('profiles', 'public');
                $validated['profile'] = $path;
            }

            $validated['favourite'] = json_encode($validated['favourite']);
            $contact->update($validated);

            return redirect()->route('contacts.index')->with('success', 'Contact updated successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->with('error', 'Failed to update Contact.');
        }
    }

    public function destroy(Contact $contact) {
        try {
            $contact->delete();

            return redirect()->back()->with('success', 'Contact deleted successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to delete contact.');
        }
    }

    public function restore($id) {
        try {
            $contact = Contact::withTrashed()->findOrFail($id);
            $contact->restore();

            return redirect()->back()->with('success', 'Contact restored successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to restore contact.');
        }
    }
}
