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
        Schema::create('savings_transactions', function (Blueprint $table) {
            $table->id('id_savings_transaction');
            $table->decimal('value_savings_transaction', 11, 2)->default(0);
            $table->enum('type_savings_transaction', ['aplicar', 'resgatar']);

            $table->unsignedBigInteger('fk_savings');
            $table->foreign('fk_savings')->references('id_savings')->on('savings')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('savings_transactions');
    }
};
