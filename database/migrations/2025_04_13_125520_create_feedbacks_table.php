<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('client_id')->constrained(
                table: "users",
                column: "id",
                indexName: "users_index"
            );
            $table->text('message');
            $table->boolean('is_anonymous')->default(false);
            $table->enum('type', [
                'SUGGESTION',
                'COMPLAINT',
                'PRAISE',
                'BUG'
            ]);
            // Related Entity (Polymorphic Relationship)
            // $table->morphs('feedbackable'); // feedbackable_id + feedbackable_type

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('feedbacks');
    }
};