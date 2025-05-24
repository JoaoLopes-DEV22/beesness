<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AccessoriesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('accessories')->insert([
            // 🎩 Cartolas (HEAD)
            ['name_accessory' => 'Cartola verde',   'price_accessory' => 150, 'level_accessory' => 15, 'type_accessory' => 'head', 'icon_accessory' => '🎩🟢', 'img_accessory' => 'cartolaVerde.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Cartola azul',    'price_accessory' => 150, 'level_accessory' => 15, 'type_accessory' => 'head', 'icon_accessory' => '🎩🔵', 'img_accessory' => 'cartolaAzul.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Cartola vermelha','price_accessory' => 150, 'level_accessory' => 15, 'type_accessory' => 'head', 'icon_accessory' => '🎩🔴', 'img_accessory' => 'cartolaVermelha.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Cartola roxa',    'price_accessory' => 150, 'level_accessory' => 15, 'type_accessory' => 'head', 'icon_accessory' => '🎩🟣', 'img_accessory' => 'cartolaRoxa.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Cartola laranja', 'price_accessory' => 150, 'level_accessory' => 15, 'type_accessory' => 'head', 'icon_accessory' => '🎩🟠', 'img_accessory' => 'cartolaLaranja.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Cartola rosa',    'price_accessory' => 150, 'level_accessory' => 15, 'type_accessory' => 'head', 'icon_accessory' => '🎩💗', 'img_accessory' => 'cartolaRosa.png', 'created_at' => now(), 'updated_at' => now()],

            // 🧢 Bonés (HEAD)
            ['name_accessory' => 'Boné azul',    'price_accessory' => 120, 'level_accessory' => 10, 'type_accessory' => 'head', 'icon_accessory' => '🧢🔵', 'img_accessory' => 'boneAzul.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Boné vermelho','price_accessory' => 120, 'level_accessory' => 10, 'type_accessory' => 'head', 'icon_accessory' => '🧢🔴', 'img_accessory' => 'boneVermelho.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Boné rosa',    'price_accessory' => 120, 'level_accessory' => 10, 'type_accessory' => 'head', 'icon_accessory' => '🧢💗', 'img_accessory' => 'boneRosa.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Boné laranja', 'price_accessory' => 120, 'level_accessory' => 10, 'type_accessory' => 'head', 'icon_accessory' => '🧢🟠', 'img_accessory' => 'boneLaranja.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Boné roxo',    'price_accessory' => 120, 'level_accessory' => 10, 'type_accessory' => 'head', 'icon_accessory' => '🧢🟣', 'img_accessory' => 'boneRoxo.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Boné verde',    'price_accessory' => 120, 'level_accessory' => 10, 'type_accessory' => 'head', 'icon_accessory' => '🧢🟢', 'img_accessory' => 'boneVerde.png', 'created_at' => now(), 'updated_at' => now()],


            // 👓 Óculos (FACE)
            ['name_accessory' => 'Óculos preto estiloso', 'price_accessory' => 90, 'level_accessory' => 5, 'type_accessory' => 'face', 'icon_accessory' => '🕶️', 'img_accessory' => 'oculosPreto.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Óculos rosa neon',      'price_accessory' => 90, 'level_accessory' => 5, 'type_accessory' => 'face', 'icon_accessory' => '🕶️💗', 'img_accessory' => 'oculosRosa.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Óculos laranja neon',      'price_accessory' => 90, 'level_accessory' => 5, 'type_accessory' => 'face', 'icon_accessory' => '🕶️🟠', 'img_accessory' => 'oculosLaranja.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Óculos verde listrado', 'price_accessory' => 90, 'level_accessory' => 5, 'type_accessory' => 'face', 'icon_accessory' => '🕶️🟢', 'img_accessory' => 'oculosVerde.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Óculos verde listrado', 'price_accessory' => 90, 'level_accessory' => 5, 'type_accessory' => 'face', 'icon_accessory' => '🕶️🔴', 'img_accessory' => 'oculosVermelho.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Óculos azul e dourado', 'price_accessory' => 90, 'level_accessory' => 5, 'type_accessory' => 'face', 'icon_accessory' => '🕶️🔵', 'img_accessory' => 'oculosAzulDourado.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Óculos redondo preto',  'price_accessory' => 90, 'level_accessory' => 5, 'type_accessory' => 'face', 'icon_accessory' => '👓⚫', 'img_accessory' => 'oculosRedondo.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Óculos arrendondado preto',  'price_accessory' => 90, 'level_accessory' => 5, 'type_accessory' => 'face', 'icon_accessory' => '👓⚫', 'img_accessory' => 'oculosArredondado.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Óculos quadrado preto',  'price_accessory' => 90, 'level_accessory' => 5, 'type_accessory' => 'face', 'icon_accessory' => '👓⬛', 'img_accessory' => 'oculosQuadrado.png', 'created_at' => now(), 'updated_at' => now()],

            // 👕 Moletons (BODY)
            ['name_accessory' => 'Moletom verde',   'price_accessory' => 200, 'level_accessory' => 8, 'type_accessory' => 'body', 'icon_accessory' => '🧥🟢', 'img_accessory' => 'moletomVerde.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Moletom azul',    'price_accessory' => 200, 'level_accessory' => 8, 'type_accessory' => 'body', 'icon_accessory' => '🧥🔵', 'img_accessory' => 'moletomAzul.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Moletom vermelho','price_accessory' => 200, 'level_accessory' => 8, 'type_accessory' => 'body', 'icon_accessory' => '🧥🔴', 'img_accessory' => 'moletomVermelho.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Moletom roxo',    'price_accessory' => 200, 'level_accessory' => 8, 'type_accessory' => 'body', 'icon_accessory' => '🧥🟣', 'img_accessory' => 'moletomRoxo.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Moletom laranja','price_accessory' => 200, 'level_accessory' => 8, 'type_accessory' => 'body', 'icon_accessory' => '🧥🟠', 'img_accessory' => 'moletomLaranja.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Moletom rosa','price_accessory' => 200, 'level_accessory' => 8, 'type_accessory' => 'body', 'icon_accessory' => '🧥💗', 'img_accessory' => 'moletomRosa.png', 'created_at' => now(), 'updated_at' => now()],


            // 👔 Ternos com gravata (BODY)
            ['name_accessory' => 'Terno verde',   'price_accessory' => 300, 'level_accessory' => 20, 'type_accessory' => 'body', 'icon_accessory' => '👔🟢', 'img_accessory' => 'ternoVerde.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Terno azul',    'price_accessory' => 300, 'level_accessory' => 20, 'type_accessory' => 'body', 'icon_accessory' => '👔🔵', 'img_accessory' => 'ternoAzul.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Terno vermelho','price_accessory' => 300, 'level_accessory' => 20, 'type_accessory' => 'body', 'icon_accessory' => '👔🔴', 'img_accessory' => 'ternoVermelho.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Terno roxo',    'price_accessory' => 300, 'level_accessory' => 20, 'type_accessory' => 'body', 'icon_accessory' => '👔🟣', 'img_accessory' => 'ternoRoxo.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Terno laranja', 'price_accessory' => 300, 'level_accessory' => 20, 'type_accessory' => 'body', 'icon_accessory' => '👔🟠', 'img_accessory' => 'ternoLaranja.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Terno rosa', 'price_accessory' => 300, 'level_accessory' => 20, 'type_accessory' => 'body', 'icon_accessory' => '👔💗', 'img_accessory' => 'ternoRosa.png', 'created_at' => now(), 'updated_at' => now()],

            // 🧥 Suéteres (BODY)
            ['name_accessory' => 'Suéter verde',   'price_accessory' => 120, 'level_accessory' => 8,  'type_accessory' => 'body', 'icon_accessory' => '🧥🟢', 'img_accessory' => 'sueterVerde.png',   'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Suéter azul',    'price_accessory' => 125, 'level_accessory' => 9,  'type_accessory' => 'body', 'icon_accessory' => '🧥🔵', 'img_accessory' => 'sueterAzul.png',    'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Suéter vermelho','price_accessory' => 130, 'level_accessory' => 10, 'type_accessory' => 'body', 'icon_accessory' => '🧥🔴', 'img_accessory' => 'sueterVermelho.png','created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Suéter roxo',    'price_accessory' => 135, 'level_accessory' => 11, 'type_accessory' => 'body', 'icon_accessory' => '🧥🟣', 'img_accessory' => 'sueterRoxo.png',    'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Suéter rosa',    'price_accessory' => 140, 'level_accessory' => 12, 'type_accessory' => 'body', 'icon_accessory' => '🧥💗', 'img_accessory' => 'sueterRosa.png',    'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Suéter laranja', 'price_accessory' => 145, 'level_accessory' => 13, 'type_accessory' => 'body', 'icon_accessory' => '🧥🟠', 'img_accessory' => 'sueterLaranja.png', 'created_at' => now(), 'updated_at' => now()],

            // 🎀 Laços (HEAD)
            ['name_accessory' => 'Laço verde',    'price_accessory' => 100, 'level_accessory' => 5,  'type_accessory' => 'head', 'icon_accessory' => '🎀🟢', 'img_accessory' => 'lacoVerde.png',    'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Laço azul',     'price_accessory' => 105, 'level_accessory' => 6,  'type_accessory' => 'head', 'icon_accessory' => '🎀🔵', 'img_accessory' => 'lacoAzul.png',     'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Laço vermelho', 'price_accessory' => 110, 'level_accessory' => 7,  'type_accessory' => 'head', 'icon_accessory' => '🎀🔴', 'img_accessory' => 'lacoVermelho.png', 'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Laço rosa',     'price_accessory' => 115, 'level_accessory' => 8,  'type_accessory' => 'head', 'icon_accessory' => '🎀💗', 'img_accessory' => 'lacoRosa.png',     'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Laço dourado',  'price_accessory' => 120, 'level_accessory' => 9,  'type_accessory' => 'head', 'icon_accessory' => '🎀🟠', 'img_accessory' => 'lacoDourado.png',  'created_at' => now(), 'updated_at' => now()],
            ['name_accessory' => 'Laço roxo',     'price_accessory' => 125, 'level_accessory' => 10, 'type_accessory' => 'head', 'icon_accessory' => '🎀🟣', 'img_accessory' => 'lacoRoxo.png',     'created_at' => now(), 'updated_at' => now()],


        ]);
    }
}