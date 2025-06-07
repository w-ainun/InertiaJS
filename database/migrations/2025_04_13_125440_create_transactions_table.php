<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('client_id')->constrained(
                table: 'users',
                column: 'id',
            );
            $table->integer('total');
            $table->text('note')->nullable();
            $table->string('payment_method', 50)->nullable();
            $table->enum('status', [
                'pending',
                'paid',
                'canceled',
                'failed',
            ])->default('pending');

            $table->string('shipping_number', 255)->nullable();
            $table->timestamp('pickup_deadline')->nullable();
            $table->timestamp('user_marked_received_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('transactions');
    }
};