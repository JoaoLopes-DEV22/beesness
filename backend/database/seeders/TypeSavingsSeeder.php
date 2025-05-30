<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeSavingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // DB::table('types')->truncate();
        DB::table('types_savings')->insert([
            [
                'name_type_savings' => 'aplicação',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name_type_savings' => 'resgate',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
