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
        Schema::create('categories', function (Blueprint $table) {
            $table->id('id_category');
            $table->string('title_category', 100);
            $table->string('color_category', 7)->default('#818B92');

            $table->unsignedBigInteger('fk_type');
            $table->foreign('fk_type')->references('id_type')->on('types')->onDelete('cascade');

            $table->unsignedBigInteger('fk_account')->nullable();
            $table->foreign('fk_account')->references('id_account')->on('accounts')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
