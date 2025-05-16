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
        Schema::create('bees', function (Blueprint $table) {
            $table->id('id_bee');
            $table->string('name_bee', 100)->default('Mel');
            $table->integer('experience_bee')->default(0);
            $table->integer('level_bee')->default(0);
            $table->unsignedBigInteger('fk_account');

            $table->foreign('fk_account')->references('id_account')->on('accounts')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bees');
    }
};
