<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model {
    use HasFactory;

    // protected $with = ['contact'];

    public function contact(): BelongsTo { // M:1
        return $this->belongsTo(Contact::class);
    }

    protected $fillable = [
        'contact_id',
        'post_code', 'country',
        'province', 'city',
        'street', 'more'
    ];
}
