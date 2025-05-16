<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'name' => 'admin',
                'email' => 'adm@gmail.com',
                // 'email_verified_at' => '',
                'birth' => '2025/01/01',
                'password' => Hash::make('123'),
                'profile_picture' => '/assets/profiles/img_profile.png',
                'banner_picture' => '/assets/banners/img_banner.png',
                // 'remember_token' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
