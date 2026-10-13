<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        Testimonial::query()->delete();

        $testimonials = [
            [
                'author_name' => 'Amina Ochieng',
                'author_role' => 'Head of IT',
                'author_company' => 'Kilimanjaro Retail Group',
                'quote' => 'The offline sync meant our stores stopped losing sales during internet outages. That alone paid for the project.',
                'avatar' => '/images/team/naledi-khumalo.svg',
                'rating' => 5,
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'author_name' => 'David Mwangi',
                'author_role' => 'Head of Operations',
                'author_company' => 'Boma Financial Services',
                'quote' => 'Reconciliation used to take our finance team days. Now it happens automatically within two hours of settlement.',
                'avatar' => '/images/team/thabo-mokoena.svg',
                'rating' => 5,
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'author_name' => 'Dr. Lindiwe Nkosi',
                'author_role' => 'Chief Medical Officer',
                'author_company' => 'Amana Health Network',
                'quote' => 'Having a single patient record across three hospitals cut duplicate tests by almost a third. Our clinicians love it.',
                'avatar' => '/images/team/mary-smith.svg',
                'rating' => 4,
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'author_name' => 'Raj Patel',
                'author_role' => 'CTO',
                'author_company' => 'Savanna Logistics',
                'quote' => 'The team treated our migration like their own business. Zero downtime, and they left us with tooling we actually understand.',
                'avatar' => '/images/team/riaan-van-wyk.svg',
                'rating' => 5,
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'author_name' => 'Sarah Kimani',
                'author_role' => 'Procurement Director',
                'author_company' => 'Atlas Manufacturing',
                'quote' => 'They guided us through ISO 27001 without a sales pitch — just a clear, repeatable plan.',
                'avatar' => '/images/team/chloe-adams.svg',
                'rating' => 4,
                'sort_order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::query()->updateOrCreate(
                ['author_name' => $testimonial['author_name']],
                $testimonial,
            );
        }
    }
}
