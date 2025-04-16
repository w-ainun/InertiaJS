<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();

            $table->foreignId("client_id")->constrained(
                table: "users",
                column: "id",
                indexName: "users_index"
            );
            $table->string("name", 100)->nullable(false);
            $table->string("phone", 20)->nullable(false);
            $table->string("profile")->nullable(false);
            $table->enum("gender", ["MAN", "WOMAN"])->nullable(false);
            $table->date("birthday")->nullable(false);
            $table->json('favourite')->nullable(true);

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('contacts');
    }
};
