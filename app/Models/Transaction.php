<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'address_id', // Make sure this is in your fillable array if you plan to mass-assign it
        'total',
        'note',
        'payment_method',
        'status',
        'delivery_status', // Added based on CartController.php
        'shipping_cost',   // Added based on CartController.php
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
                    ->withPivot('quantity', 'price_at_time', 'discount_percentage_at_time') // Added discount_percentage_at_time
                    ->withTimestamps();
    }

    /**
     * Get the delivery address for the transaction.
     */
    public function address(): BelongsTo //  ADD THIS RELATIONSHIP
    {
        // Assumes your transactions table has an 'address_id' foreign key
        // and your addresses table is named 'addresses' (the model is 'Address')
        return $this->belongsTo(Address::class, 'address_id', 'id');
    }

    public function voucher(): BelongsTo
    {
        return $this->belongsTo(Voucher::class, 'voucher_id', 'id'); // Pastikan 'voucher_id' adalah foreign key yang benar
    }
    public function ratings(): HasMany // Add this relationship
    {
        return $this->hasMany(Rating::class, 'transaction_id', 'id'); //
    }
}