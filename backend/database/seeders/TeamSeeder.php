<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        TeamMember::query()->delete();

        // The founding team. More people are added through the admin panel
        // as the company grows.
        TeamMember::query()->create([
            'name' => 'Fanuel Otuya',
            'role' => 'Founder & Chief Executive Officer',
            'bio' => 'Founded Otuya Global after fifteen years leading engineering organisations across Southern Africa. Sets the direction and spends most of his time with clients understanding what actually needs to change.',
            'image' => '/images/team/fanuel-otuya.svg',
            'email' => 'fanuel@otuyaelite.com',
            'linkedin_url' => 'https://www.linkedin.com/in/otuyaelite',
            'sort_order' => 1,
        ]);
    }
}
