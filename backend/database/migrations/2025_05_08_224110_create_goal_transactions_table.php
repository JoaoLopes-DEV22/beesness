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
        Schema::create('goal_transactions', function (Blueprint $table) {
            $table->id('id_goal_transaction');
            $table->decimal('value_goal_transaction', 11, 2)->default(0);

            $table->unsignedBigInteger('fk_type_savings');
            $table->foreign('fk_type_savings')->references('id_type_savings')->on('types_savings')->onDelete('cascade');

            $table->unsignedBigInteger('fk_goal');
            $table->foreign('fk_goal')->references('id_goal')->on('goals')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('goal_transactions');
    }
};
