<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'title' => 'Otuya POS rollout for Kilimanjaro Retail Group',
                'client' => 'Kilimanjaro Retail Group',
                'summary' => 'Deployed and integrated Otuya POS across 42 stores, tying in central inventory, loyalty and real-time analytics.',
                'body' => "Kilimanjaro Retail Group runs 42 outlets across Nairobi and Mombasa. Their previous point-of-sale system lost sales every time the network dropped and gave them no visibility into which items were moving where.\n\nWe deployed Otuya POS on existing hardware, added offline-first resilience with background sync, and wired it to a central inventory service. The loyalty engine now drives repeat visits, and managers get a real-time dashboard per store.\n\nResult: 14 percent lift in same-store sales in the first quarter, and a 90 percent drop in end-of-day reconciliation time.\n\nTechnologies: Otuya POS, Node.js edge sync, PostgreSQL, Stripe Terminal.",
                'technologies' => ['Otuya POS', 'Node.js', 'PostgreSQL', 'Stripe Terminal'],
                'cover_image' => '/images/projects/retail-analytics.svg',
                'project_url' => 'https://otuyaglobal.com',
                'is_featured' => true,
                'is_published' => true,
                'completed_at' => '2025-03-10',
                'sort_order' => 1,
            ],
            [
                'title' => 'Core banking integration for Boma Financial Services',
                'client' => 'Boma Financial Services',
                'summary' => 'Built an Otuya Financials integration layer connecting mobile money, agency banking and the core ledger.',
                'body' => "Boma Financial Services needed to accept deposits from eight mobile-money providers and 200 agency agents, all posting to a legacy core banking ledger with no API.\n\nWe used Otuya Financials as the integration hub, building adapter connectors for each provider and a reconciliation engine that matches settlements within two hours.\n\nThe agency network now onboards customers without a branch visit, and finance reconciles cash-in-transit automatically.\n\nTechnologies: Otuya Financials, Java, Kafka, Oracle FLEXCUBE, M-Pesa Daraja.",
                'technologies' => ['Otuya Financials', 'Java', 'Apache Kafka', 'Oracle FLEXCUBE'],
                'cover_image' => '/images/projects/fintech-platform.svg',
                'project_url' => 'https://otuyaglobal.com',
                'is_featured' => true,
                'is_published' => true,
                'completed_at' => '2024-11-22',
                'sort_order' => 2,
            ],
            [
                'title' => 'e-Health Hospital ERP for Amana Health Network',
                'client' => 'Amana Health Network',
                'summary' => 'Rolled out Otuya e-Health ERP across three hospitals and twelve clinics, unifying patient records and billing.',
                'body' => "Amana Health Network operated three hospitals and twelve clinics on disconnected systems: paper charts in some units, a separate billing system, and another platform for lab results.\n\nWe deployed Otuya e-Health Hospital ERP with a central patient index, integrated laboratory and radiology modules, and an insurance claims engine that reduced outstanding receivables.\n\nStaff now access a single patient record across facilities, and the finance team cuts month-end close from ten days to four.\n\nTechnologies: Otuya e-Health, Laravel, Vue, PostgreSQL, HL7 integration.",
                'technologies' => ['Otuya e-Health', 'Laravel', 'Vue', 'PostgreSQL', 'HL7'],
                'cover_image' => '/images/projects/healthcare-portal.svg',
                'project_url' => 'https://otuyaglobal.com',
                'is_featured' => true,
                'is_published' => true,
                'completed_at' => '2025-01-18',
                'sort_order' => 3,
            ],
            [
                'title' => 'Cloud migration for Savanna Logistics',
                'client' => 'Savanna Logistics',
                'summary' => 'Migrated on-premises workloads to AWS with zero downtime, cutting infrastructure cost by 38 percent.',
                'body' => "Savanna Logistics ran a fleet-tracking platform on four aging servers in an on-site rack. Power outages took operations down twice a month, and capacity planning was guesswork.\n\nWe moved them to AWS using a blue-green cutover, containerized the tracking engine with ECS, and added automated scaling tied to delivery volume.\n\nDowntime is now a thing of the past, and they pay only for what they use. We included a FinOps dashboard so they can see spend by route.\n\nTechnologies: AWS ECS, Terraform, PostgreSQL, Grafana, Redis.",
                'technologies' => ['AWS ECS', 'Terraform', 'PostgreSQL', 'Grafana', 'Redis'],
                'cover_image' => '/images/projects/cloud-modernisation.svg',
                'project_url' => 'https://otuyaglobal.com',
                'is_featured' => false,
                'is_published' => true,
                'completed_at' => '2024-07-14',
                'sort_order' => 4,
            ],
            [
                'title' => 'Supply-chain visibility for Blue Kudu e-Commerce',
                'client' => 'Blue Kudu e-Commerce',
                'summary' => 'Real-time inventory and order tracking across warehouses and last-mile partners.',
                'body' => "Blue Kudu ships perishables across East Africa and needed real-time stock visibility across its Nairobi warehouse and last-mile partners in Kampala and Kigali.\n\nWe built a supply-chain visibility layer on Otuya POS infrastructure, integrating warehouse scanners, two logistics APIs, and a mobile app for riders.\n\nOrders now track from click to doorstep, and stock-outs dropped by 60 percent after the first month.\n\nTechnologies: Otuya POS, React Native, Node.js, MongoDB, Twilio.",
                'technologies' => ['Otuya POS', 'React Native', 'Node.js', 'MongoDB', 'Twilio'],
                'cover_image' => '/images/projects/logistics-platform.svg',
                'project_url' => 'https://otuyaglobal.com',
                'is_featured' => false,
                'is_published' => true,
                'completed_at' => '2024-09-30',
                'sort_order' => 5,
            ],
            [
                'title' => 'ISO 27001 compliance for Atlas Manufacturing',
                'client' => 'Atlas Manufacturing',
                'summary' => 'Hardened security posture and achieved ISO 27001 certification across ERP and plant-floor systems.',
                'body' => "Atlas Manufacturing, a steel fabrication plant, needed ISO 27001 certification to keep a major automotive contract. Their ERP and plant-floor systems had no central logging, and access was shared.\n\nWe embedded Otuya Manufacturing ERP security controls, segmented the plant network, deployed a SIEM pipeline, and ran tabletop exercises with the team.\n\nCertification passed on the first audit, and they renewed the automotive contract for another three years.\n\nTechnologies: Otuya Manufacturing ERP, Wazuh, Keycloak, pfSense.",
                'technologies' => ['Otuya Manufacturing ERP', 'Wazuh', 'Keycloak', 'pfSense'],
                'cover_image' => '/images/projects/manufacturing-quality.svg',
                'project_url' => 'https://otuyaglobal.com',
                'is_featured' => false,
                'is_published' => true,
                'completed_at' => '2024-12-05',
                'sort_order' => 6,
            ],
        ];

        foreach ($projects as $project) {
            Project::query()->updateOrCreate(
                ['title' => $project['title']],
                $project,
            );
        }
    }
}
