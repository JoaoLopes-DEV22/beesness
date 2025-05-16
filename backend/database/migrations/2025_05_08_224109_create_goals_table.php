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
        Schema::create('goals', function (Blueprint $table) {
            $table->id('id_goal');
            $table->string('title_goal', 100);
            $table->decimal('target_goal', 11, 2)->default(0);
            $table->date('deadline_goal')->nullable();
            $table->unsignedBigInteger('fk_account');
            $table->foreign('fk_account')->references('id_account')->on('accounts')->onDelete('cascade');

            $table->unsignedBigInteger('fk_condition');
            $table->foreign('fk_condition')->references('id_condition')->on('conditions')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('goals');
    }
};
