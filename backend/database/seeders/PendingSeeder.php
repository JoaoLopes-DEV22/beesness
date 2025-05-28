<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PendingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        DB::table('pendings')->insert([
            [
                'title_pending' => 'Salário do mês',
                'initial_pending' => 5000.00,
                'total_pending' => 5000.00,
                'deadline_pending' => '2025-11-05',
                'fk_type' => 1,
                'fk_category' => 11, // Salário
                'fk_account' => 1,
                'fk_condition' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_pending' => 'Site pra Loja',
                'initial_pending' => 2300.00,
                'total_pending' => 5300.00,
                'deadline_pending' => '2025-11-15',
                'fk_type' => 1,
                'fk_category' => 12, // Freelance
                'fk_account' => 1,
                'fk_condition' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_pending' => 'Venda do Notebook',
                'initial_pending' => 1200.00,
                'total_pending' => 5200.00,
                'deadline_pending' => '2025-11-08',
                'fk_type' => 1,
                'fk_category' => 13, // Venda
                'fk_account' => 1,
                'fk_condition' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_pending' => 'Reembolso de Viagem',
                'initial_pending' => 5450.00,
                'total_pending' => 5450.00,
                'deadline_pending' => '2025-11-20',
                'fk_type' => 1,
                'fk_category' => 10, // Sem categoria (receita)
                'fk_account' => 1,
                'fk_condition' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_pending' => 'Aluguel do Apartamento',
                'initial_pending' => 1500.00,
                'total_pending' => 5500.00,
                'deadline_pending' => '2025-11-05',
                'fk_type' => 2,
                'fk_category' => 4, // Moradia
                'fk_account' => 1,
                'fk_condition' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_pending' => 'Fatura do Cartão de Crédito',
                'initial_pending' => 1200.00,
                'total_pending' => 5200.00,
                'deadline_pending' => '2025-11-10',
                'fk_type' => 2,
                'fk_category' => 1, // Sem categoria (despesa)
                'fk_account' => 1,
                'fk_condition' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_pending' => 'Conta de Luz',
                'initial_pending' => 5180.00,
                'total_pending' => 5180.00,
                'deadline_pending' => '2025-11-15',
                'fk_type' => 2,
                'fk_category' => 9, // Serviços
                'fk_account' => 1,
                'fk_condition' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_pending' => 'Parcela do Financiamento do Carro',
                'initial_pending' => 850.00,
                'total_pending' => 5850.00,
                'deadline_pending' => '2025-11-20',
                'fk_type' => 2,
                'fk_category' => 5, // Transporte
                'fk_account' => 1,
                'fk_condition' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_pending' => 'Supermercado',
                'initial_pending' => 5350.00,
                'total_pending' => 5350.00,
                'deadline_pending' => '2025-11-12',
                'fk_type' => 2,
                'fk_category' => 2, // Alimentação
                'fk_account' => 1,
                'fk_condition' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
