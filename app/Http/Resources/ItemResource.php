<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource {
    public function toArray(Request $request): array {
        return [
            'id'           => $this->id,
            'category_id'  => $this->category_id,
            'name'         => $this->name,
            'unit'         => $this->unit,
            'price'        => $this->price,
            'stock'        => $this->stock,
            'image_url'    => $this->image_url,
            'is_available' => $this->is_available,
            'description'  => $this->description,
            'discount'     => $this->discount,
            'expired_at'   => $this->expired_at,
            'created_at'   => $this->created_at,
            'updated_at'   => $this->updated_at,
            'category'     => new CategoryResource($this->whenLoaded('category')),
        ];
    }
}
