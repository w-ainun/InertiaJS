// database/migrations/2025_04_13_125551_create_ratings_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('item_id')->constrained(
                table: 'items',
                column: 'id',
            )->onDelete('cascade'); // Added onDelete for better integrity

            $table->foreignId('transaction_id')->constrained( // Add this
                table: 'transactions',
                column: 'id',
            )->onDelete('cascade'); // Added onDelete for better integrity

            $table->foreignId('client_id')->constrained( // Add this
                table: 'users', // Assuming 'users' is your client table
                column: 'id',
            )->onDelete('cascade'); // Added onDelete for better integrity

            $table->tinyInteger('score');
            $table->string('comment')->nullable();

            $table->timestamps();

            // Add a unique constraint to prevent multiple reviews for the same item in the same transaction by the same client
            $table->unique(['transaction_id', 'item_id', 'client_id']); //
        });
    }

    public function down(): void {
        Schema::dropIfExists('ratings');
    }
};