<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany; // <-- Add this line

class Transaction extends Model {
    use HasFactory;

    // protected $with = ['user', 'items']; // Consider if you always need these

    public function user(): BelongsTo { // M:1
        return $this->belongsTo(User::class, 'client_id', 'id');
    }

    /**
     * Defines the relationship to get all individual detail lines for this transaction.
     */
    public function details(): HasMany { // <-- ADD THIS RELATIONSHIP
        return $this->hasMany(TransactionDetail::class, 'transaction_id', 'id');
    }

    /**
     * Defines a many-to-many relationship to items through transaction_details.
     * Note: The pivot column in your TransactionDetail model/migration is 'quantity', not 'qty'.
     * Adjust 'qty' to 'quantity' below if that's the case.
     */
    public function items(): BelongsToMany { // M:N
        return $this->belongsToMany(Item::class, 'transaction_details', 'transaction_id', 'item_id')
                    ->withPivot('quantity', 'price_at_time') // <-- Changed 'qty' to 'quantity' assuming consistency
                    ->withTimestamps();
    }

    protected $fillable = [
        'client_id',
        'total', 'note', 'payment_method', 'status'
    ];
}