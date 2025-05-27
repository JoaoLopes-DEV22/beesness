<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Decoration; // Importe o Model Decoration
use Illuminate\Support\Facades\Schema; // Importe o Schema para desativar FKs

class DecorationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // Desativa temporariamente as chaves estrangeiras para permitir o truncate
        Schema::disableForeignKeyConstraints();
        Decoration::truncate(); // Limpa a tabela antes de popular
        Schema::enableForeignKeyConstraints();

        // Baú
        Decoration::create([
            'name_decoration' => 'Baú',
            'price_decoration' => 75.00,
            'icon_decoration' => '📦', // Emoji para ícone
            'img_decoration' => 'images/bau_full.png', // Placeholder para imagem real
            'level_decoration' => 4,
        ]);

        // Abajur (claro ou escuro)
        Decoration::create([
            'name_decoration' => 'Abajur Claro',
            'price_decoration' => 75.00,
            'icon_decoration' => '💡⚪', // Emoji para ícone (lâmpada + círculo branco)
            'img_decoration' => 'images/abajur_claro_full.png', // Placeholder
            'level_decoration' => 5,
        ]);
        Decoration::create([
            'name_decoration' => 'Abajur Escuro',
            'price_decoration' => 75.00,
            'icon_decoration' => '💡⚫', // Emoji para ícone (vela + círculo preto)
            'img_decoration' => 'images/abajur_escuro_full.png', // Placeholder
            'level_decoration' => 5,
        ]);

        // Poltronas (vermelho, roxo, laranja, azul, verde e rosa)
        $poltrona_colors = [
            'Vermelha' => '🛋️🔴',
            'Roxa' => '🛋️🟣',
            'Laranja' => '🛋️🟠',
            'Azul' => '🛋️🔵',
            'Verde' => '🛋️🟢',
            'Rosa' => '🛋️🌸' // Mantendo flor, pois não há círculo rosa
        ];
        foreach ($poltrona_colors as $color_name => $emoji) {
            Decoration::create([
                'name_decoration' => 'Poltrona ' . $color_name,
                'price_decoration' => 100.00,
                'icon_decoration' => $emoji,
                'img_decoration' => 'images/poltrona_' . strtolower(str_replace(' ', '_', $color_name)) . '_full.png', // Placeholder
                'level_decoration' => 6,
            ]);
        }

        // Estantes (clara e escura/ com ou sem livros)
        Decoration::create([
            'name_decoration' => 'Estante Clara (Com mel)',
            'price_decoration' => 125.00,
            'icon_decoration' => '🗄️⚪', // Emoji para ícone (armário + círculo branco)
            'img_decoration' => 'images/estante_clara_vazia_full.png', // Placeholder
            'level_decoration' => 8,
        ]);
        Decoration::create([
            'name_decoration' => 'Estante Clara (Com Livros)',
            'price_decoration' => 125.00,
            'icon_decoration' => '📚⚪', // Emoji para ícone (livros + círculo branco)
            'img_decoration' => 'images/estante_clara_com_livros_full.png', // Placeholder
            'level_decoration' => 8,
        ]);
        Decoration::create([
            'name_decoration' => 'Estante Escura (Com mel)',
            'price_decoration' => 125.00,
            'icon_decoration' => '🗄️⚫', // Emoji para ícone (armário + círculo preto)
            'img_decoration' => 'images/estante_escura_vazia_full.png', // Placeholder
            'level_decoration' => 8,
        ]);
        Decoration::create([
            'name_decoration' => 'Estante Escura (Com Livros)',
            'price_decoration' => 125.00,
            'icon_decoration' => '📖⚫', // Emoji para ícone (livro aberto + círculo preto)
            'img_decoration' => 'images/estante_escura_com_livros_full.png', // Placeholder
            'level_decoration' => 8,
        ]);

        // Televisão (clara e escura)
        Decoration::create([
            'name_decoration' => 'Televisão Clara',
            'price_decoration' => 150.00,
            'icon_decoration' => '📺⚪', // Emoji para ícone (TV + círculo branco)
            'img_decoration' => 'images/tv_clara_full.png', // Placeholder
            'level_decoration' => 11,
        ]);
        Decoration::create([
            'name_decoration' => 'Televisão Escura',
            'price_decoration' => 150.00,
            'icon_decoration' => '🖥️⚫', // Emoji para ícone (monitor + círculo preto)
            'img_decoration' => 'images/tv_escura_full.png', // Placeholder
            'level_decoration' => 11,
        ]);

        // Cofre
        Decoration::create([
            'name_decoration' => 'Cofre',
            'price_decoration' => 175.00,
            'icon_decoration' => '💰', // Emoji para ícone
            'img_decoration' => 'images/cofre_icon.png', // Placeholder
            'level_decoration' => 13,
        ]);

        // Estátua do campeão
        Decoration::create([
            'name_decoration' => 'Estátua do Campeão',
            'price_decoration' => 500.00,
            'icon_decoration' => '🏆', // Emoji para ícone
            'img_decoration' => 'images/estatua_campeao_full.png', // Placeholder
            'level_decoration' => 15,
        ]);
    }
}