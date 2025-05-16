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
        Schema::create('pendings', function (Blueprint $table) {
            $table->id('id_pending');
            $table->string('title_pending', 100);
            $table->decimal('value_pending', 11, 2)->default(0);
            $table->date('deadline_pending')->nullable();

            $table->unsignedBigInteger('fk_type');
            $table->foreign('fk_type')->references('id_type')->on('types')->onDelete('cascade');

            $table->unsignedBigInteger('fk_category');
            $table->foreign('fk_category')->references('id_category')->on('categories')->onDelete('cascade');

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
        Schema::dropIfExists('pendings');
    }
};
