<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreItemRequest extends FormRequest {
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'name'         => ['required', 'string', 'max:100'],
            'unit'         => ['required', 'string', 'max:20'],
            'price'        => ['required', 'integer', 'min:0'],
            'stock'        => ['required', 'integer', 'min:0'],
            'image_url'    => ['required', 'url'],
            'is_available' => ['boolean'],
            'description'  => ['nullable', 'string'],
            'discount'     => ['nullable', 'numeric', 'between:0,100'],
            'expired_at'   => ['required', 'date', 'after_or_equal:today'],
        ];
    }

    public function messages(): array {
        return [
            'name.required'             => 'Item name is required.',
            'name.max'                  => 'Item name may not be greater than 100 characters.',

            'unit.max'                  => 'Unit may not exceed 20 characters.',

            'price.required'            => 'Price is required.',
            'price.integer'             => 'Price must be a valid integer.',
            'price.min'                 => 'Price cannot be negative.',

            'stock.required'            => 'Stock is required.',
            'stock.integer'             => 'Stock must be a valid integer.',
            'stock.min'                 => 'Stock cannot be negative.',

            'image_url.required'        => 'Image URL is required.',
            'image_url.url'             => 'Image URL must be a valid URL.',

            // 'is_available.boolean'      => 'Availability must be true or false.',

            'discount.numeric'          => 'Discount must be a number.',
            'discount.between'          => 'Discount must be between 0 and 100.',

            'expired_at.required'       => 'Expiration date is required.',
            'expired_at.date'           => 'Expiration date must be a valid date.',
            'expired_at.after_or_equal' => 'Expiration date must be today or later.',
        ];
    }
}
