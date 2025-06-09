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
            $table->string('payment_method', 50)->nullable()->change();
            // $table->enum('payment_method', [
            //     'cash',
            //     'bank',
            //     'e-wallet'
            // ])->default('cash');
            $table->enum('status', [
                'pending',
                'paid',
                'canceled',
                'failed'
            ])->default('pending');
            $table->enum('delivery_status', [
                'menunggu',
                'diambil', 
                'sedang dikirim', 
                'selesai'
            ])->default('menunggu');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('transactions');
    }
};
