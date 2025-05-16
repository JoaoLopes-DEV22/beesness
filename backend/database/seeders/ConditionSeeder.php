<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConditionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // DB::table('conditions')->truncate();
        DB::table('conditions')->insert([
            [
                'title_condition' => 'pendente',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_condition' => 'concluído',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
