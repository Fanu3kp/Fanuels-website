<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            SettingSeeder::class,
            ServiceSeeder::class,
            ProcessStepSeeder::class,
            ProjectSeeder::class,
            TeamSeeder::class,
            TestimonialSeeder::class,
            BlogSeeder::class,
        ]);
    }
}