<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon; // Add this

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'address_id',
        'total',
        'note',
        'payment_method',
        'status',
        'delivery_option',
        'shipping_cost',
        'shipping_number',      // Added
        'pickup_deadline',      // Added
        'user_marked_received_at', // Added
    ];

    // Add this to automatically cast to Carbon instances
    protected $casts = [
        'pickup_deadline' => 'datetime',
        'user_marked_received_at' => 'datetime',
    ];

    /**
     * Get the user that owns the transaction.
     */
    public function user(): BelongsTo // M:1
    {
        return $this->belongsTo(User::class, 'client_id', 'id');
    }

    /**
     * Defines the relationship to get all individual detail lines for this transaction.
     */
    public function details(): HasMany
    {
        return $this->hasMany(TransactionDetail::class, 'transaction_id', 'id');
    }

    /**
     * Defines a many-to-many relationship to items through transaction_details.
     */
    public function items(): BelongsToMany // M:N
    {
        return $this->belongsToMany(Item::class, 'transaction_details', 'transaction_id', 'item_id')
                    ->withPivot('quantity', 'price_at_time', 'discount_percentage_at_time')
                    ->withTimestamps();
    }

    /**
     * Get the delivery address for the transaction.
     */
    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class, 'address_id', 'id');
    }

    // Helper to calculate if pickup deadline has passed (optional)
    public function hasPickupDeadlinePassed(): bool
    {
        return $this->delivery_option === 'pickup' && $this->pickup_deadline && $this->pickup_deadline->isPast();
    }
}