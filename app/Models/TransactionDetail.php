<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // <-- Add this line

class TransactionDetail extends Model {
    use HasFactory;

    protected $fillable = [
        'transaction_id', 'item_id',
        'quantity', 'price_at_time'
    ];

    /**
     * Get the item associated with the transaction detail.
     */
    public function item(): BelongsTo { // <-- ADD THIS RELATIONSHIP
        return $this->belongsTo(Item::class, 'item_id', 'id');
    }

    /**
     * Get the transaction that this detail belongs to.
     */
    public function transaction(): BelongsTo { // <-- OPTIONAL BUT GOOD PRACTICE
        return $this->belongsTo(Transaction::class, 'transaction_id', 'id');
    }
}