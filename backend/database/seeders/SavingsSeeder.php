<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SavingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('savings')->insert([
            [
                'balance_savings' => 0,
                'tax_savings' => 0,
                'fk_account' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
