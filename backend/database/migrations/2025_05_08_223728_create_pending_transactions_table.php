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
        Schema::create('pending_transactions', function (Blueprint $table) {
            $table->id('id_pending_transaction');
            $table->decimal('value_pending_transaction', 11, 2)->default(0);

            $table->unsignedBigInteger('fk_type_savings');
            $table->foreign('fk_type_savings')->references('id_type_savings')->on('types_savings')->onDelete('cascade');

            $table->unsignedBigInteger('fk_pending');
            $table->foreign('fk_pending')->references('id_pending')->on('pendings')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pending_transactions');
    }
};
