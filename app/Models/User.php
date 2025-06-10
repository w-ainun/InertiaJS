<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable {
    use HasFactory, Notifiable, SoftDeletes;

    protected $table = 'users';
    protected $primaryKey = 'id';

    public function transactions(): HasMany {
        return $this->hasMany(Transaction::class, 'client_id', 'id');
    }

    public function contacts(): HasMany {
        return $this->hasMany(Contact::class, 'user_id', 'id');
    }

    public function favorites(): HasMany 
    {
        return $this->hasMany(Favorite::class);
    }

    public function favoritedItems(): BelongsToMany 
    {
        return $this->belongsToMany(Item::class, 'favorites', 'user_id', 'item_id')
                    ->withTimestamps();
    }

    public function hasFavorited(int $itemId): bool
    {
        return $this->favorites()->where('item_id', $itemId)->exists();
    }

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
        'status',
        'avatar',
        'email_verified_at',
        'google_id',
        'google_token',
        'google_refresh_token',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'google_token',
        'google_refresh_token',
    ];

    protected function casts(): array {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
