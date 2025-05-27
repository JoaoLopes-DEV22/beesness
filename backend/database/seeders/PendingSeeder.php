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
                'value_pending' => 3000.00,
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
                'value_pending' => 2300.00,
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
                'value_pending' => 1200.00,
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
                'value_pending' => 450.00,
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
                'value_pending' => 1500.00,
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
                'value_pending' => 1200.00,
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
                'value_pending' => 180.00,
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
                'value_pending' => 850.00,
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
                'value_pending' => 350.00,
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
