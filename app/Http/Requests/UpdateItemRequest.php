<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateItemRequest extends FormRequest {
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'name'         => ['sometimes', 'string', 'max:100'],
            'unit'         => ['sometimes', 'string', 'max:20'],
            'price'        => ['sometimes', 'integer', 'min:0'],
            'stock'        => ['sometimes', 'integer', 'min:0'],
            'image_url'    => ['sometimes', 'url'],
            // 'is_available' => ['sometimes', 'boolean'],
            'description'  => ['sometimes', 'string', 'nullable'],
            'discount'     => ['sometimes', 'numeric', 'between:0,100'],
            'expired_at'   => ['sometimes', 'date', 'after_or_equal:today'],
        ];
    }

    public function messages(): array {
        return [
            'name.max'                  => 'Item name may not be greater than 100 characters.',

            'unit.max'                  => 'Unit may not exceed 20 characters.',

            'price.integer'             => 'Price must be a valid integer.',
            'price.min'                 => 'Price cannot be negative.',

            'stock.integer'             => 'Stock must be a valid integer.',
            'stock.min'                 => 'Stock cannot be negative.',

            'image_url.url'             => 'Image URL must be a valid URL.',

            // 'is_available.boolean'      => 'Availability must be true or false.',

            'discount.numeric'          => 'Discount must be a number.',
            'discount.between'          => 'Discount must be between 0 and 100.',

            'expired_at.date'           => 'Expiration date must be a valid date.',
            'expired_at.after_or_equal' => 'Expiration date must be today or later.',
        ];
    }

}
