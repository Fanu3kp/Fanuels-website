<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'title' => 'ERP Implementation',
                'icon' => 'erp',
                'image' => '/images/solutions/erp.svg',
                'summary' => 'We design, deploy, and customize enterprise resource planning systems that connect disparate business departments into a single, cohesive operational hub.',
                'body' => "We design, deploy, and customize enterprise resource planning systems that connect disparate business departments into a single, cohesive operational hub, providing real-time data visibility across finance, supply chains, and human capital.\n\nEvery deployment begins with a fit-gap assessment against your actual operating model, not a generic template. We configure, migrate and validate the system in parallel with your existing operations so the business keeps trading throughout the transition.\n\nYou are left with documented processes, trained staff and a system your own team can extend without us.",
                'highlights' => ['Finance', 'Supply chain', 'Human capital', 'Real-time reporting'],
                'sort_order' => 1,
                'is_featured' => true,
            ],
            [
                'title' => 'Custom Software Development',
                'icon' => 'code',
                'image' => '/images/solutions/software.svg',
                'summary' => 'Our engineering teams build tailored, scalable web and mobile applications using robust architectural frameworks to solve unique business challenges.',
                'body' => "Our engineering teams build tailored, scalable web and mobile applications using robust architectural frameworks to solve unique business challenges and secure a distinct competitive edge.\n\nWe work in small squads that ship in two-week increments, so you see working software early and often rather than a large reveal at the end. Source control, automated test coverage and a deployment pipeline are in place from day one.\n\nTechnology choices are made to fit your team's existing skills and your long-term hiring plan, not our preferred stack.",
                'highlights' => ['Web applications', 'Mobile applications', 'Robust architecture', 'API development'],
                'sort_order' => 2,
                'is_featured' => true,
            ],
            [
                'title' => 'Digital Transformation Consulting',
                'icon' => 'strategy',
                'image' => '/images/solutions/transformation.svg',
                'summary' => 'Strategic, end-to-end advisory services that guide organizations through technology adoption, workflow modernization, and process optimization.',
                'body' => "We provide strategic, end-to-end advisory services that guide organizations through technology adoption, workflow modernization, and process optimization.\n\nEngagements start with an assessment of where your technology estate actually stands and what it is costing you. From there we produce a prioritized roadmap with honest sequencing, a build-versus-buy recommendation per workstream, and a budget you can plan against.\n\nThe advisory work does not stop at the report. We stay through implementation, because a roadmap nobody executes is just a document.",
                'highlights' => ['Technology adoption', 'Workflow modernization', 'Process optimization', 'Change management'],
                'sort_order' => 3,
                'is_featured' => false,
            ],
            [
                'title' => 'Cloud & Infrastructure Services',
                'icon' => 'cloud',
                'image' => '/images/solutions/cloud.svg',
                'summary' => 'From cloud migrations to infrastructure optimization on AWS, Azure, and Google Cloud, we equip businesses with high-performance environments.',
                'body' => "From cloud migrations to infrastructure optimization on AWS, Azure, and Google Cloud, we equip businesses with high-performance, secure, and flexible environments.\n\nWe start with a cost model rather than a vendor preference, because cloud spend is where reliability and budget quietly diverge. Infrastructure is provisioned as code, and monitoring and alerting are wired up before launch rather than after the first incident.\n\nYou also get a documented recovery path, so your team can operate the environment confidently after handover.",
                'highlights' => ['AWS', 'Azure', 'Google Cloud', 'Cloud migration', 'Infrastructure optimization'],
                'sort_order' => 4,
                'is_featured' => false,
            ],
            [
                'title' => 'Specialized Vertical Solutions',
                'icon' => 'products',
                'image' => '/images/solutions/vertical.svg',
                'summary' => 'Tailored software platforms including Otuya POS, Otuya Financials and Otuya e-Health ERP, built for specific industries.',
                'body' => "We develop and deploy tailored software platforms for industries where generic tools fall short.\n\nOtuya POS serves retail and distribution, covering multi-site stock, pricing and reporting in environments where connectivity is unreliable. Otuya Financials is built for SACCOs and microfinance institutions, with member management, loan portfolios and statutory reporting handled in one system. Otuya e-Health ERP integrates hospital management, from patient records and scheduling through to pharmacy and laboratory workflows.\n\nEach platform is configurable enough to fit how your organisation actually operates, and specific enough that competitors are still using spreadsheets.",
                'highlights' => ['Otuya POS', 'Otuya Financials', 'Otuya e-Health ERP'],
                'sort_order' => 5,
                'is_featured' => true,
            ],
        ];

        foreach ($services as $service) {
            $service['slug'] = Str::slug($service['title']);
            $service['is_active'] = true;

            Service::query()->updateOrCreate(['title' => $service['title']], $service);
        }

        // Retire any service from an earlier seed run that is no longer offered.
        Service::query()
            ->whereNotIn('title', array_column($services, 'title'))
            ->update(['is_active' => false]);
    }
}
