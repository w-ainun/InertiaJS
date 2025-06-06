<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest {
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'image_url'   => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:5120'],
            'description' => ['nullable', 'string'],
        ];
    }

    public function messages(): array {
        return [
            'name.required'      => 'The category name is required.',
            'image_url.required' => 'Category image is Required',
            'image_url.image'    => 'The uploaded image must be a valid image.',
            'image_url.mimes'    => 'The image must be in JPEG, PNG, JPG, or WEBP format.',
            'image_url.max'      => 'The image may not be greater than 5MB.',
        ];
    }
}
