<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Feedback extends Model {
    use HasFactory;

    protected $with = ['user'];

    public function user(): BelongsTo { // M:1
        return $this->belongsTo(User::class, 'client_id', 'id');
    }

    protected $fillable = [
        'client_id',
        'message', 'is_anonymous', 'type',
    ];
}