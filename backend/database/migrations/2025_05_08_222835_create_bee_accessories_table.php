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
        Schema::create('bee_accessories', function (Blueprint $table) {
            $table->id('id_bee_accessories');
            $table->unsignedBigInteger('fk_cosmetic_status');
            $table->foreign('fk_cosmetic_status')->references('id_cosmetic_status')->on('cosmetic_status');

            $table->unsignedBigInteger('fk_bee');
            $table->foreign('fk_bee')->references('id_bee')->on('bees');

            $table->unsignedBigInteger('fk_accessory');
            $table->foreign('fk_accessory')->references('id_accessory')->on('accessories');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bee_accessories');
    }
};
