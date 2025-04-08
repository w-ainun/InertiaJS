<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    /** @use HasFactory<\Database\Factories\AdminFactory> */
    use HasFactory;

    // public static function find($slug): array {
    //     return Arr::first(static::all, function($post) use ($slug)) {
    //         return $post['slug'] == $slug;
    //     }
    //      OR
        // $post = Arr::first(statis::all(), fn ($spot) => $post['slug'] == $slug);
        // if (!$post) {
        //     abort(404);
        // }
        // return $post;
    // }


}
