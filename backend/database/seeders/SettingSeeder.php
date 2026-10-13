<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'company_name' => 'Otuya Global',
            'tagline' => 'Business and technology, engineered together.',
            'about_heading' => 'We build the systems that move businesses forward',
            'about_body' => "Otuya Global was founded by Fanuel Otuya, a visionary entrepreneur with a passion for building technology that delivers real business outcomes. The company was built to give growing organisations access to senior engineering and delivery expertise without the overhead of a large firm.\n\nWe start with your problem, not our portfolio. Whether you need a platform built, a legacy system modernised, or a cloud foundation put in place, we work as an extension of your team — clear scope, transparent pricing, and senior people on every engagement.\n\nWe are just getting started and looking for our first clients and partners. If you have a problem worth solving, we would like to hear about it.",
            'solutions_heading' => 'Our Core Solutions',
            'solutions_intro' => 'We offer a comprehensive suite of enterprise-grade services engineered to streamline operations, enhance security, and drive measurable efficiency:',
            'process_heading' => 'Our Engagement Process',
            'process_intro' => 'Every successful engagement follows a proven, transparent six-stage collaboration methodology.',
            'contact_email' => 'fanuelotuya2@gmail.com',
            'contact_phone' => '+254705774020',
            'contact_address' => 'Waiyaki Way,.P.O BOX 40034-00100, Nairobi , Kenya',
            'contact_map_embed' => 'https://www.google.com/maps?q=-1.2864,36.8172&hl=en&z=14&output=embed',
            'office_hours' => 'Monday to Friday, 7:45am - 18:00pm',
            'social_facebook' => 'https://www.facebook.com/otuyaelite',
            'social_linkedin' => 'https://www.linkedin.com/company/otuyaelite',
            'social_instagram' => 'https://www.instagram.com/otuyaelite',
            'social_tiktok' => 'https://www.tiktok.com/@otuyaelite',
            'social_youtube' => 'https://www.youtube.com/@otuyaelite',
        ];

        foreach ($settings as $key => $value) {
            Setting::put($key, $value);
        }
    }
}
