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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id('id_account');
            $table->decimal('incomes_account', 11, 2)->default(0);
            $table->decimal('expenses_account', 11, 2)->default(0);
            $table->decimal('balance_account', 11, 2)->default(0);
            $table->decimal('sunflowers_account', 11, 2)->default(0);
            $table->unsignedBigInteger('fk_user');

            $table->foreign('fk_user')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
