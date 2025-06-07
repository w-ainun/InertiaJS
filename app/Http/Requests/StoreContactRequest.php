<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest {
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'user_id' => ['required'],
            'name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
            // 'profile' => ['nullable', 'url'],
            'profile' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:5120'],
            'gender' => ['required', 'in:MAN,WOMAN'],
            'birthday' => ['nullable', 'date'],
            'favourite' => ['required', 'array'],
            'favourite.*' => ['string', 'max:50'],
        ];
    }

    public function messages(): array {
        return [
            'user_id'=> 'The contact mush have User',

            'name.required' => 'The name field is required.',
            'name.string' => 'The name must be a valid stri ng.',
            'name.max' => 'The name may not exceed 100 characters.',

            'phone.required' => 'The phone field is required.',
            'phone.string' => 'The phone number must be a valid string.',
            'phone.max' => 'The phone number may not exceed 20 characters.',

            // 'profile.url' => 'The profile must be a valid URL.',
            // 'profile.required' => 'Profile is required.',
            'profile.image' => 'The profile must be an image.',
            'profile.mimes' => 'The profile must be a file of type: jpeg, png, jpg, gif.',
            'profile.max' => 'The profile image may not be larger than 5MB.',

            'gender.required' => 'Gender is required.',
            'gender.in' => 'The selected gender is invalid. Please choose either MAN or WOMAN.',

            // 'birthday.required' => 'Birthday is required.',
            'birthday.date' => 'Please enter a valid date for the birthday.',

            'favourite.array' => 'The favourite field must be an array.',
            'favourite.*.string' => 'Each favourite item must be a valid string.',
            'favourite.*.max' => 'Each favourite item may not exceed 50 characters.',
        ];
    }
}