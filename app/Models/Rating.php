<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rating extends Model {
    use HasFactory;

    protected $fillable = [
        'item_id',
        'transaction_id', // Add this
        'client_id',      // Add this
        'score',
        'comment'
    ];

    public function item(): BelongsTo {
        return $this->belongsTo(Item::class, 'item_id', 'id');
    }

    public function transaction(): BelongsTo { // Add this relationship
        return $this->belongsTo(Transaction::class, 'transaction_id', 'id');
    }

    public function client(): BelongsTo { // Add this relationship for the user who gave the rating
        return $this->belongsTo(User::class, 'client_id', 'id');
    }
}