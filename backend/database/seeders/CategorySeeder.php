<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // DB::table('categories')->truncate();
        DB::table('categories')->insert([
            [
                'title_category' => 'sem categoria',
                'color_category' => '#818B92',
                'fk_type' => '1',
                'fk_account' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_category' => 'alimentação',
                'color_category' => '#818B92',
                'fk_type' => '2',
                'fk_account' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_category' => 'lazer',
                'color_category' => '#818B92',
                'fk_type' => '2',
                'fk_account' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_category' => 'moradia',
                'color_category' => '#818B92',
                'fk_type' => '2',
                'fk_account' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_category' => 'transporte',
                'color_category' => '#818B92',
                'fk_type' => '2',
                'fk_account' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_category' => 'saúde',
                'color_category' => '#818B92',
                'fk_type' => '2',
                'fk_account' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_category' => 'educação',
                'color_category' => '#818B92',
                'fk_type' => '2',
                'fk_account' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_category' => 'vestuário',
                'color_category' => '#818B92',
                'fk_type' => '2',
                'fk_account' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_category' => 'serviços',
                'color_category' => '#818B92',
                'fk_type' => '2',
                'fk_account' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_category' => 'salário',
                'color_category' => '#818B92',
                'fk_type' => '1',
                'fk_account' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_category' => 'freelance',
                'color_category' => '#818B92',
                'fk_type' => '1',
                'fk_account' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_category' => 'venda',
                'color_category' => '#818B92',
                'fk_type' => '1',
                'fk_account' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_category' => 'aposentadoria',
                'color_category' => '#818B92',
                'fk_type' => '1',
                'fk_account' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
