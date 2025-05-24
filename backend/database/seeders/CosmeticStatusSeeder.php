<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CosmeticStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('cosmetic_status')->insert([
            [
                'type_cosmetic_status' => 'equipped',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type_cosmetic_status' => 'unequipped',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
