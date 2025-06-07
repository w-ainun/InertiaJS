<?php

namespace App\Http\Controllers\Admin;

use App\Models\Category;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class AdminCategoryController extends Controller {
    public function index() {
        $categories = Category::all();

        return Inertia::render('admins/categories/index', [
            'categories' => CategoryResource::collection($categories),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function create() {
        return Inertia::render('admins/categories/create', [
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function store(StoreCategoryRequest $request) {
        try {
            $validated = $request->validated();

            if ($request->hasFile('image_url')) {
                $imageUrl = $request->file('image_url')->store('categories', 'public');
                $validated['image_url'] = $imageUrl;
            }

            Category::create($validated);
            return redirect()->route('categories.index')->with('success', 'Category created successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to create category.');
        }
    }

    public function show(Category $category) {
        $category->all();

        return Inertia::render('admins/categories/show', [
            'categories' => new CategoryResource($category),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function edit(Category $category) {
        return Inertia::render('admins/categories/edit', [
            'category' => new CategoryResource($category),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category) {
        try {
            $validated = $request->validated();


            if ($request->hasFile('image_url')) {
                $path = $request->file('image_url')->store('categories', 'public');
                $validated['image_url'] = $path;
            }
            $category->update($validated);

            return redirect()->route('categories.index')->with('success', 'Category updated successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to update category.');
        }
    }

    public function destroy(Category $category) {
        try {
            $category->delete();

            return redirect()->back()->with('success', 'Category deleted successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to delete category.');
        }
    }
}
