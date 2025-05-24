<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('bees')->insert([
            [
                'name_bee' => 'Mel',
                'experience_bee' => 500,
                'level_bee' => 10,
                'fk_account' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
