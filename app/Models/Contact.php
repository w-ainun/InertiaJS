<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany; // Import HasMany
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model {
    use HasFactory, SoftDeletes;

    // protected $with = ['user', 'addresses']; // Eager load plural addresses

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, "user_id", "id")->withTrashed();
    }

    public function addresses(): HasMany {
        return $this->hasMany(Address::class, "contact_id", "id");
    }

    protected $fillable = [
        'user_id',
        'name',
        'gender',
        'phone',
        'profile',
        'birthday',
        'favourite',
    ];

    protected $casts = [
        'favourite' => 'array',
        'birthday' => 'date',
    ];
}
