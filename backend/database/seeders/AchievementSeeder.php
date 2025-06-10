<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Achievement;
use Illuminate\Support\Facades\Schema; // Importe o Facade Schema

class AchievementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // 1. Desativa a verificação de chaves estrangeiras temporariamente
        Schema::disableForeignKeyConstraints();

        // Limpa a tabela achievements
        Achievement::truncate();

        // 2. Reativa a verificação de chaves estrangeiras
        Schema::enableForeignKeyConstraints();

        // Cria as conquistas com os títulos, descrições e a NOVA distribuição de XP/Girassóis
        Achievement::create([
            'title_goal' => 'Mel na chupeta',
            'description_achievement' => 'Entre na guia de conquistas (desculpa para um prêmio de boas vindas).',
            'experience_achievement' => 1300,
            'sunflowers_achievement' => 150,
        ]);

        Achievement::create([
            'title_goal' => 'CAF(Cadastro de Abelha Física)',
            'description_achievement' => 'Troque o nome da sua abelha.',
            'experience_achievement' => 1320,
            'sunflowers_achievement' => 200,
        ]);

        Achievement::create([
            'title_goal' => 'Cada um no seu favo',
            'description_achievement' => 'Crie pelo menos uma categoria de ganhos e uma de despesas.',
            'experience_achievement' => 1340,
            'sunflowers_achievement' => 300,
        ]);

        Achievement::create([
            'title_goal' => 'Contabeelidade',
            'description_achievement' => 'Registre pelo menos uma transação de receita e uma de despesa.',
            'experience_achievement' => 1360,
            'sunflowers_achievement' => 400,
        ]);

        Achievement::create([
            'title_goal' => 'O néctar do estilo',
            'description_achievement' => 'Altere seu banner e foto de perfil.',
            'experience_achievement' => 1360,
            'sunflowers_achievement' => 600,
        ]);

        Achievement::create([
            'title_goal' => 'Zangado com as dívidas',
            'description_achievement' => 'Conclua pelo menos uma pendência.',
            'experience_achievement' => 1380,
            'sunflowers_achievement' => 600,
        ]);

        Achievement::create([
            'title_goal' => 'Melhor operária',
            'description_achievement' => 'Entre na Beesnees pelo menos uma vez na semana por um mês.',
            'experience_achievement' => 1380,
            'sunflowers_achievement' => 600,
        ]);

        Achievement::create([
            'title_goal' => 'Arquiteto de favos',
            'description_achievement' => 'Coloque duas decorações em sua colmeia.',
            'experience_achievement' => 1400,
            'sunflowers_achievement' => 700,
        ]);

        Achievement::create([
            'title_goal' => 'Polinizador',
            'description_achievement' => 'Junte 500 girassóis.',
            'experience_achievement' => 1400,
            'sunflowers_achievement' => 800,
        ]);

        Achievement::create([
            'title_goal' => 'Cumprindo prazzzo',
            'description_achievement' => 'Crie e conclua pelo menos uma meta.',
            'experience_achievement' => 1400,
            'sunflowers_achievement' => 950,
        ]);

        Achievement::create([
            'title_goal' => 'Enxarme completo',
            'description_achievement' => 'Equipe acessórios para cabeça, rosto e corpo.',
            'experience_achievement' => 1360,
            'sunflowers_achievement' => 500,
        ]);

        Achievement::create([
            'title_goal' => 'M-El Dourado',
            'description_achievement' => 'Compre a decoração “Estátua do campeão”.',
            'experience_achievement' => 0,
            'sunflowers_achievement' => 500,
        ]);
    }
}