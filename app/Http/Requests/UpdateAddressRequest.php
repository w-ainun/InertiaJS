<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAddressRequest extends FormRequest {
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'post_code'  => ['sometimes', 'required', 'string', 'max:10'],
            'country'    => ['sometimes', 'required', 'string', 'max:100'],
            'province'   => ['sometimes', 'required', 'string', 'max:100'],
            'city'       => ['sometimes', 'required', 'string', 'max:100'],
            'street'     => ['sometimes', 'required', 'string', 'max:200'],
            'more'       => ['nullable', 'string'],
        ];
    }

    public function messages(): array {
        return [
            'post_code.required'  => 'Post code is required.',
            'post_code.string'    => 'Post code must be a string.',
            'post_code.max'       => 'Post code cannot exceed 10 characters.',

            'country.required'    => 'Country is required.',
            'country.string'      => 'Country must be a string.',
            'country.max'         => 'Country cannot exceed 100 characters.',

            'province.required'   => 'Province is required.',
            'province.string'     => 'Province must be a string.',
            'province.max'        => 'Province cannot exceed 100 characters.',

            'city.required'       => 'City is required.',
            'city.string'         => 'City must be a string.',
            'city.max'            => 'City cannot exceed 100 characters.',

            'street.required'     => 'Street is required.',
            'street.string'       => 'Street must be a string.',
            'street.max'          => 'Street cannot exceed 200 characters.',

            'more.string'         => 'More info must be a string.',
        ];
    }
}
