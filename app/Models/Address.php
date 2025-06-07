<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Address extends Model {
    use HasFactory, SoftDeletes;

    // protected $with = ['contact']; // Uncomment if you want to eager load contact when fetching an address

    public function contact(): BelongsTo { // M:1
        return $this->belongsTo(Contact::class, 'contact_id', 'id')->withTrashed();
    }

    protected $fillable = [
        'contact_id',
        'post_code',
        'country',
        'province',
        'city',
        'street',
        'more'
    ];
}
