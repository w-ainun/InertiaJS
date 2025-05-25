<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable // singular version from table
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    use SoftDeletes;

    // override
    protected $table = 'users'; // default  plural table
    protected $primaryKey = 'id'; // default primaryKey
    // protected $with = [
    //     'transactions',
    //     // 'feedbacks',
    //     'contacts',
    // ]; // lazy->eager loading

    public function transactions(): HasMany { // 1:M
        return $this->hasMany(Transaction::class, 'client_id', 'id');
    }

    // public function feedbacks(): HasMany { // 1:M
    //     return $this->hasMany(Feedback::class, 'client_id', 'id');
    // }

    public function contacts(): HasMany{ // 1:M
        return $this->hasMany(Contact::class, 'user_id', 'id');
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username', 'email',
        'password', 'role',
        'status', 'avatar',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
