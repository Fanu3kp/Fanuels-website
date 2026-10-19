<?php

namespace Database\Seeders;

use App\Models\ProcessStep;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProcessStepSeeder extends Seeder
{
    public function run(): void
    {
        $steps = [
            [
                'step_number' => 1,
                'title' => 'Business Discovery',
                'icon' => 'discovery',
                'image' => '/images/process/discovery.svg',
                'summary' => 'Senior consultants analyze your operational workflows, competitive landscape, regulatory requirements, and technical constraints to define clear KPIs and ROI targets.',
                'body' => "We begin with an intensive discovery phase where senior consultants analyze your operational workflows, competitive landscape, regulatory requirements, and technical constraints.\n\nThe output is a shared definition of success: clear KPIs, an agreed ROI target, and an honest view of what is achievable in your timeframe. If the numbers do not justify the investment, we say so here rather than after the build.",
                'sort_order' => 1,
            ],
            [
                'step_number' => 2,
                'title' => 'Solutions Architecture',
                'icon' => 'architecture',
                'image' => '/images/process/architecture.svg',
                'summary' => 'Our architects design a scalable blueprint that integrates modern software frameworks with secure database models.',
                'body' => "Our architects design a scalable blueprint that integrates modern software frameworks with secure database models.\n\nYou receive a system design that accounts for growth, security boundaries and the skills your team already has. Key decisions are documented with their reasoning, so future maintainers understand not just what was built but why.",
                'sort_order' => 2,
            ],
            [
                'step_number' => 3,
                'title' => 'Agile Development',
                'icon' => 'development',
                'image' => '/images/process/development.svg',
                'summary' => 'Engineering teams build your custom platform iteratively, delivering functional milestones with complete transparency.',
                'body' => "Engineering teams build your custom platform iteratively, delivering functional milestones with complete transparency.\n\nSprints are short, demos are frequent, and the working software is always visible. You can redirect course while a change is still cheap, which is far preferable to discovering a misalignment at launch.",
                'sort_order' => 3,
            ],
            [
                'step_number' => 4,
                'title' => 'Deployment & Launch',
                'icon' => 'deployment',
                'image' => '/images/process/deployment.svg',
                'summary' => 'We oversee rigorous quality assurance, data migration, and seamless system deployment to ensure minimal disruption to your daily operations.',
                'body' => "We oversee rigorous quality assurance, data migration, and seamless system deployment to ensure minimal disruption to your daily operations.\n\nData is migrated and verified in parallel with the existing system, so there is always a working fallback. Go-live is a rehearsed cutover with a defined rollback path, not an event that happens to you.",
                'sort_order' => 4,
            ],
            [
                'step_number' => 5,
                'title' => 'Team Empowerment',
                'icon' => 'training',
                'image' => '/images/process/training.svg',
                'summary' => 'We conduct thorough capacity-building programs and hands-on training to equip your staff with full operational confidence.',
                'body' => "We conduct thorough capacity-building programs and hands-on training to equip your staff with full operational confidence.\n\nTraining is role-based and hands-on, delivered against your real data rather than a sandbox. Your team leaves able to run, configure and extend the system without calling us for every change.",
                'sort_order' => 5,
            ],
            [
                'step_number' => 6,
                'title' => 'Growth Partnership',
                'icon' => 'partnership',
                'image' => '/images/process/partnership.svg',
                'summary' => 'We provide round-the-clock technical support, proactive system updates, and ongoing strategic enhancements as your business scales.',
                'body' => "We provide round-the-clock technical support, proactive system updates, and ongoing strategic enhancements as your business scales.\n\nThe relationship does not end at go-live. We monitor proactively, patch ahead of problems, and revisit the roadmap as your requirements change, so the system keeps earning its cost.",
                'sort_order' => 6,
            ],
        ];

        foreach ($steps as $step) {
            $step['slug'] = Str::slug($step['title']);
            $step['is_active'] = true;

            ProcessStep::query()->updateOrCreate(['title' => $step['title']], $step);
        }
    }
}
