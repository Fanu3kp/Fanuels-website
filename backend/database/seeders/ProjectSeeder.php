<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        // Otuya is newly founded — there is no client project history yet.
        // Case studies are added through the admin panel as work is delivered.
        Project::query()->delete();
    }
}
