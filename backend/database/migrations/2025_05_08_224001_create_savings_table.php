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
        Schema::create('savings', function (Blueprint $table) {
            $table->id('id_savings');
            $table->decimal('balance_savings', 11, 2)->default(0);
            $table->decimal('tax_savings', 5, 2)->default(0);

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
        Schema::dropIfExists('savings');
    }
};
