<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('delivery_option')->default('delivery')->after('status');
            $table->decimal('shipping_cost', 10, 2)->default(0.00)->after('delivery_option');
            $table->foreignId('address_id')->nullable()->after('shipping_cost')->constrained('addresses')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['address_id']);
            $table->dropColumn('address_id');
            $table->dropColumn('shipping_cost');
            $table->dropColumn('delivery_option');
        });
    }
};