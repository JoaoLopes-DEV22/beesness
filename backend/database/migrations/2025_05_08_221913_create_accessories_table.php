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
        Schema::create('accessories', function (Blueprint $table) {
            $table->id('id_accessory');
            $table->string('name_accessory', 100);
            $table->decimal('price_accessory', 11, 2);
            $table->string('icon_accessory', 255);
            $table->string('img_accessory', 255);
            $table->integer('level_accessory');
            $table->enum('type_accessory', ['head', 'face', 'body']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accessories');
    }
};
