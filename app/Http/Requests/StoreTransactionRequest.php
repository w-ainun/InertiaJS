<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest {
    public function authorize(): bool {
        return false;
    }

    public function rules(): array {
        return [
            //
        ];
    }
}