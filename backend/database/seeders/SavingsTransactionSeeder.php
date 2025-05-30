<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SavingsTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('savings_transactions')->insert([
            [   
                'value_savings_transaction' => 1000,
                'fk_type_savings' => 1,
                'fk_savings' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
