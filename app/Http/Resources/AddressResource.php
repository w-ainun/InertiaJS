<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource {
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'contact_id' => $this->contact_id,
            'post_code' => $this->post_code,
            'country' => $this->country,
            'province' => $this->province,
            'city' => $this->city,
            'street' => $this->street,
            'more' => $this->more,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
            'contact' => new ContactResource($this->whenLoaded('contact')),
            // 'user' => new UserResource(optional($this->contact)->user),
        ];
    }
}
