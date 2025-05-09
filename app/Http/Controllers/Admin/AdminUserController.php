<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller {
    public function index() {
        //
    }

    public function create() {
        //
    }

    public function store(StoreUserRequest $request) {
        // try {
        //     $validated = $request->validated();
        // } catch (\Exception $e) {
        //
        // }
    }

    public function show(User $user) {
        //
    }

    public function edit(User $user) {
        //
    }

    public function update(UpdateUserRequest $request, User $user) {
        //
    }

    public function destroy(User $user) {
        //
    }
}
