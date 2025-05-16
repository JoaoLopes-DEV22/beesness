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
        Schema::create('hive_decorations', function (Blueprint $table) {
            $table->id('id_hive_decoration');
            $table->enum('position_hive_decoration', ['right', 'left', 'none']);
            $table->unsignedBigInteger('fk_cosmetic_status');
            $table->foreign('fk_cosmetic_status')->references('id_cosmetic_status')->on('cosmetic_status');

            $table->unsignedBigInteger('fk_decoration');
            $table->foreign('fk_decoration')->references('id_decoration')->on('decorations');

            $table->unsignedBigInteger('fk_account');
            $table->foreign('fk_account')->references('id_account')->on('accounts');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hive_decorations');
    }
};
