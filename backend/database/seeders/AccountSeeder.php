<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('accounts')->insert([
            [
                'incomes_account' => 0,
                'expenses_account' => 0,
                'balance_account' => 0,
                'sunflowers_account' => 0,
                'fk_user' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
