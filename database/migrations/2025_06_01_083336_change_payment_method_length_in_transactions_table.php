<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Change the payment_method column to a VARCHAR with a new length, e.g., 50
            // Ensure this matches the original column type, just changing the length.
            // If it was `string` in the original migration, this is fine.
            $table->string('payment_method', 50)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Revert to the previous length if known, or a sensible default.
            // This depends on what the original length was.
            // For example, if it was VARCHAR(15):
            // $table->string('payment_method', 15)->nullable()->change();
            // Or, if you're unsure, you might leave this to restore from a backup
            // or decide on a common shorter length. For safety, just changing it
            // and not providing a specific down for length is also common if rollback
            // isn't strictly for this length change.
            // For this example, let's assume you might want to revert to a common default.
            // Be cautious here, as data truncation could occur if you shorten it again.
            $table->string('payment_method', 20)->nullable()->change(); // Example of reverting
        });
    }
};