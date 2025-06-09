<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('delivery_option')->default('delivery')->after('status');
            $table->decimal('shipping_cost', 10, 2)->default(0.00)->after('delivery_option');
            $table->foreignId('address_id')->nullable()->after('shipping_cost')->constrained('addresses')->onDelete('set null');
            $table->timestamp('user_marked_received_at')->nullable()->after('status');
        });

        DB::statement("ALTER TABLE `transactions` CHANGE `status` `status` ENUM('pending', 'paid', 'settlement', 'dikemas', 'dalam_pengiriman', 'diterima', 'selesai', 'canceled', 'failed', 'expired', 'deny') NOT NULL DEFAULT 'pending'");
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['address_id']);
            $table->dropColumn('address_id');
            $table->dropColumn('shipping_cost');
            $table->dropColumn('delivery_option');
            $table->dropColumn('user_marked_received_at');
        });

        DB::statement("ALTER TABLE `transactions` CHANGE `status` `status` ENUM('pending', 'paid', 'settlement', 'dikemas', 'diterima', 'selesai', 'canceled', 'failed', 'expired', 'deny') NOT NULL DEFAULT 'pending'");
    }
};