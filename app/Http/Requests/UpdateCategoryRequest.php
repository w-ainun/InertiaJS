<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest {
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'name'        => 'sometimes|required|string|max:255',
            'image_url'   => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
            'description' => 'nullable|string',
        ];
    }

    public function messages(): array {
        return [
            'name.required'   => 'The category name is required when provided.',
            'image_url.file'  => 'The uploaded image must be a valid file.',
            'image_url.mimes' => 'The image must be in JPEG, PNG, JPG, or WEBP format.',
            'image_url.max'   => 'The image may not be greater than 2MB.',
        ];
    }
}
