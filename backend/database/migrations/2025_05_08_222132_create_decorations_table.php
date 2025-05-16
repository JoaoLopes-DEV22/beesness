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
        Schema::create('decorations', function (Blueprint $table) {
            $table->id('id_decoration');
            $table->string('name_decoration', 100);
            $table->decimal('price_decoration', 11, 2);
            $table->string('icon_decoration', 255);
            $table->string('img_decoration', 255);
            $table->integer('level_decoration');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('decorations');
    }
};
