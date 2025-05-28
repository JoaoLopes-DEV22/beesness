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
            $table->foreign('fk_account')->references('id_account')->on('accounts')->onDelete('cascade');

            $table->boolean('is_completed')->default(false); // Se a condição da conquista foi atingida pela conta
            $table->boolean('is_claimed')->default(false);   // Se a conta já resgatou a recompensa
            $table->timestamp('completed_at')->nullable(); // Quando a conquista foi concluída pela conta
            $table->timestamp('claimed_at')->nullable();   // Quando a recompensa foi resgatada pela conta

            $table->unsignedBigInteger('fk_achievements');
            $table->foreign('fk_achievements')->references('id_achievement')->on('achievements')->onDelete('cascade');

            
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
