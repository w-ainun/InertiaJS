<?php

namespace App\Http\Controllers\Admin;

use App\Models\Item;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Http\Resources\ItemResource;
use Inertia\Inertia;


class AdminItemController extends Controller {
    public function index() {
        $items = Item::with('category')->get();

        return Inertia::render('admins/products/index', [
            'items' => ItemResource::collection($items),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function create() {
        //
    }

    public function store(StoreItemRequest $request) {
        //
    }

    public function show(Item $item) {
        //
    }

    public function edit(Item $item) {
        //
    }

    public function update(UpdateItemRequest $request, Item $item) {
        //
    }

    public function destroy(Item $item) {
        //
    }
}