<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('transactions')->insert([
            [   
                'title_transaction' => 'Salário',
                'value_transaction' => 3000,
                'fk_type' => 1,
                'fk_category' => 11,
                'fk_account' => 1,
                'created_at' => '2025-04-10 17:26:00',
                'updated_at' => '2025-04-10 17:26:00',
            ],
            [   
                'title_transaction' => 'Mensalidade da Faculdade',
                'value_transaction' => 950,
                'fk_type' => 2,
                'fk_category' => 7,
                'fk_account' => 1,
                'created_at' => '2025-04-10 17:26:00',
                'updated_at' => '2025-04-10 17:26:00',
            ],
            [   
                'title_transaction' => 'Salário',
                'value_transaction' => 3000,
                'fk_type' => 1,
                'fk_category' => 11,
                'fk_account' => 1,
                'created_at' => '2025-05-10 17:26:00',
                'updated_at' => '2025-05-10 17:26:00',
            ],
            [   
                'title_transaction' => 'Mensalidade da Faculdade',
                'value_transaction' => 950,
                'fk_type' => 2,
                'fk_category' => 7,
                'fk_account' => 1,
                'created_at' => '2025-05-10 17:26:00',
                'updated_at' => '2025-05-10 17:26:00',
            ],
            [   
                'title_transaction' => 'Consulta no Cardiologista',
                'value_transaction' => 100,
                'fk_type' => 2,
                'fk_category' => 6,
                'fk_account' => 1,
                'created_at' => '2025-05-10 17:26:00',
                'updated_at' => '2025-05-10 17:26:00',
            ],
            [   
                'title_transaction' => 'Lanche no SENAI',
                'value_transaction' => 7,
                'fk_type' => 2,
                'fk_category' => 2,
                'fk_account' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [   
                'title_transaction' => 'Camisa da Nike',
                'value_transaction' => 80,
                'fk_type' => 2,
                'fk_category' => 8,
                'fk_account' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [   
                'title_transaction' => 'Uber pro Shopping',
                'value_transaction' => 25,
                'fk_type' => 2,
                'fk_category' => 5,
                'fk_account' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [   
                'title_transaction' => 'Red Dead Redemption 2',
                'value_transaction' => 299,
                'fk_type' => 2,
                'fk_category' => 3,
                'fk_account' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [   
                'title_transaction' => 'Landing Page pra Sorveteria',
                'value_transaction' => 500,
                'fk_type' => 1,
                'fk_category' => 12,
                'fk_account' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [   
                'title_transaction' => 'Janta na Pizzaria',
                'value_transaction' => 80,
                'fk_type' => 2,
                'fk_category' => 2,
                'fk_account' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
