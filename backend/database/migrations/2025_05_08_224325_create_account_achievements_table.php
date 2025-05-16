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
        Schema::create('account_achievements', function (Blueprint $table) {
            $table->id('id_account_achievement');
            $table->unsignedBigInteger('fk_account');
            $table->foreign('fk_account')->references('id_account')->on('accounts');

            $table->unsignedBigInteger('fk_achievements');
            $table->foreign('fk_achievements')->references('id_achievement')->on('achievements');

            $table->unsignedBigInteger('fk_condition');
            $table->foreign('fk_condition')->references('id_condition')->on('conditions');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_achievements');
    }
};
