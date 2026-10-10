<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        // No client testimonials yet — the company is newly founded.
        // Testimonials are added through the admin panel as they come in.
        Testimonial::query()->delete();
    }
}
