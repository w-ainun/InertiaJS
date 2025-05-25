<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model {
    use HasFactory;

    // protected $with = ['items'];

    public function items(): HasMany { // 1:M
        return $this->hasMany(Item::class);
    }

    protected $fillable = ['name', 'slug'];
}