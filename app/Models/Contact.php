<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contact extends Model {
    use HasFactory;

    // protected $with = ['user', 'addresses'];

    public function user(): BelongsTo { // M:1
        return $this->belongsTo(User::class, "user_id", "id");
    }

    public function addresses(): HasMany { // 1:M
        return $this->hasMany(Address::class, "contact_id", "id");
    }

    protected $fillable = [
        'user_id',
        'name', 'gender', 'phone',
        'profile', 'birthday', 'favourite',
    ];
}