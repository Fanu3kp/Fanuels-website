<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
$teamMembers = [
            ['name' => 'Fanuel Otuya', 'role' => 'Founder & Chief Executive Officer', 'bio' => 'Founded Otuya Global after fifteen years leading engineering organisations across Southern Africa. Sets the direction and spends most of his time with clients understanding what actually needs to change.', 'image' => '/images/team/fanuel-otuya.svg', 'email' => 'fanuel@otuyaelite.com', 'linkedin_url' => 'https://www.linkedin.com/in/otuyaelite', 'sort_order' => 1],
            ['name' => 'Loyce Wanjiru', 'role' => 'Project Manager', 'bio' => 'Monitors all projects in this organisation hence ensure every task is completed on time', 'image' => '/images/team/naledi-khumalo.svg', 'sort_order' => 2],
            ['name' => 'John Weche', 'role' => 'Finance Officer', 'bio' => 'He is a System software developer', 'image' => '/images/team/john-doe.svg', 'sort_order' => 3],
            ['name' => 'Daniel Owino', 'role' => 'HR', 'bio' => 'Directs and Manages human Resources', 'image' => '/images/team/sipho-ndlovu.svg', 'sort_order' => 4],
            ['name' => 'Dr. Wanjiru Njoroge', 'role' => 'Lead Solutions Architect', 'bio' => 'Dr. Wanjiru is a senior architect with 15+ years of experience designing enterprise systems for financial institutions across East Africa. She holds a PhD in Computer Science from the University of Nairobi and has led over 50 major system implementations.', 'image' => '/images/team/thabo-mokoena.svg', 'sort_order' => 5],
            ['name' => 'Kevin Omondi', 'role' => 'Head of DevOps & Cloud', 'bio' => 'Kevin leads our cloud infrastructure and DevOps practice. A certified AWS Solutions Architect with 12 years of experience, he has architected deployments for companies ranging from startups to Fortune 500 enterprises across the region. He is passionate about infrastructure-as-code and CI/CD optimization.', 'image' => '/images/team/mary-smith.svg', 'sort_order' => 6],
            ['name' => 'Diana Mutua', 'role' => 'Product Lead', 'bio' => 'Diana leads product development at Otuya Global, focusing on building scalable, user-centric software products. With a background in both design and engineering, she bridges the gap between technical feasibility and business value. She has shipped products serving over 2 million users across Africa.', 'image' => '/images/team/chloe-adams.svg', 'sort_order' => 7],
            ['name' => 'Abdullahi Suleiman', 'role' => 'Security Practice Lead', 'bio' => 'Abdullahi heads our cybersecurity initiatives, bringing 14 years of experience in enterprise security architecture. He holds CISSP, CISM, and OSCP certifications and has led security audits and penetration testing for major financial institutions across East Africa.', 'image' => '/images/team/riaan-van-wyk.svg', 'sort_order' => 8],
            ['name' => 'Fatima Ali', 'role' => 'QA Lead & DevOps Engineer', 'bio' => 'Fatima oversees quality assurance and deployment pipelines at Otuya Global. With 10 years of experience in software testing and infrastructure automation, she has implemented CI/CD systems that deploy to production 20+ times per day with zero-downtime strategies. She is a certified Kubernetes Administrator and AWS DevOps Professional.', 'image' => '/images/team/ayanda-dlamini.svg', 'sort_order' => 9],
            ['name' => 'Carlos Mendoza', 'role' => 'Lead Mobile Engineer', 'bio' => 'Carlos leads our mobile engineering practice, building cross-platform applications for iOS and Android using Flutter and React Native. With 12 years of experience, he has shipped mobile apps for fintech, healthcare, and logistics clients across 5 continents. He is a Google Developer Expert in Flutter.', 'image' => '/images/team/kevin-omondi.svg', 'sort_order' => 10],
            ['name' => 'Priya Sharma', 'role' => 'Head of Product Strategy', 'bio' => 'Priya guides product strategy and client success at Otuya Global. With a background in both business and technology, she bridges the gap between client needs and technical possibilities. She has helped launch 30+ digital products across fintech, agritech, and healthtech sectors in emerging markets.', 'image' => '/images/team/fatima-ali.svg', 'sort_order' => 11],
        ];

        foreach (\ as \) {\n            TeamMember::updateOrCreate(['name' => \['name']], \);\n        }\n    }\n}\n

