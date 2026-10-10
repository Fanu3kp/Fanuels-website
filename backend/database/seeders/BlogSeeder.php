<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $authorId = User::query()->where('email', 'admin@otuyaelite.com')->value('id');

        $categories = [
            ['name' => 'Engineering', 'description' => 'Build practices, architecture decisions and lessons from delivery.'],
            ['name' => 'Cloud', 'description' => 'Infrastructure, operations and keeping cloud spend under control.'],
            ['name' => 'Business', 'description' => 'How technology decisions affect the commercial outcome.'],
            ['name' => 'Security', 'description' => 'Practical hardening and compliance guidance.'],
        ];

        $categoryIds = [];

        foreach ($categories as $category) {
            $category['slug'] = Str::slug($category['name']);

            $categoryIds[$category['name']] = Category::query()->updateOrCreate(
                ['name' => $category['name']],
                $category
            )->id;
        }

        $posts = [
            [
                'category' => 'Engineering',
                'title' => 'Why we write tests before we write features',
                'excerpt' => 'The real return on testing is not fewer bugs. It is the confidence to change code you did not write.',
                'image' => '/images/posts/tests-before-features.svg',
                'body' => "Teams often treat test coverage as a quality metric to report upward. That framing misses the point.\n\nThe real return is change confidence. When a test suite is fast and trustworthy, engineers refactor freely, upgrade dependencies without dread, and accept work on parts of the system they did not build.\n\nOur practical rules: test behaviour rather than implementation, keep the suite under ten minutes, and treat a red build as a stop-the-line condition. Anything slower than that gets ignored, and an ignored suite protects nothing.\n\nCoverage percentage matters less than whether the tests would catch a real regression.",
                'days_ago' => 12,
            ],
            [
                'category' => 'Cloud',
                'title' => 'Three cloud cost mistakes we see in every audit',
                'excerpt' => 'Orphaned storage, always-on non-production, and missing shutdown policies. Usually 20 to 40 percent of the bill.',
                'image' => '/images/posts/cloud-cost-mistakes.svg',
                'body' => "After reviewing a number of cloud estates, the same three issues account for most of the avoidable spend.\n\nFirst, storage that nothing references any more. Object storage bills accumulate quietly, and nobody deletes what they cannot see.\n\nSecond, non-production environments running around the clock. Staging does not need to be sized like production, and it definitely does not need to run at 3am.\n\nThird, missing auto-shutdown on development instances. A single forgotten test server can cost more than the entire backup strategy.\n\nNone of these require a replatform. They require an inventory, an owner, and a monthly review.",
                'days_ago' => 30,
            ],
            [
                'category' => 'Business',
                'title' => 'Buy versus build is a staffing decision',
                'excerpt' => 'The licence fee is the small part of the total. Ongoing maintenance is what decides it.',
                'image' => '/images/posts/buy-versus-build.svg',
                'body' => "Buy-versus-build comparisons usually start with licence cost against build cost and stop there. That framing is misleading.\n\nA purchased platform still consumes engineering time: integrations, data migration, customisation, upgrades and the ongoing training of staff. For a heavily customised system, that cost can exceed the licence several times over.\n\nThe useful question is what your engineers are uniquely positioned to build. If your competitive advantage lives in your product logic, keep that in house and buy everything adjacent to it.\n\nWhere the platform is the product, build. Where it is a utility, buy.",
                'days_ago' => 48,
            ],
            [
                'category' => 'Security',
                'title' => 'Your backups are not tested until you have restored one',
                'excerpt' => 'A green backup dashboard proves the job ran. It says nothing about whether the data is recoverable.',
                'image' => '/images/posts/backup-restore-drill.svg',
                'body' => "Untested backups fail in a specific way: they run successfully every night for two years, and then fail at the exact moment they are needed.\n\nCommon causes are retention policies that delete the last good copy alongside the corrupt one, credentials that expired, and restores that were never attempted because the target environment had no room.\n\nWe schedule a restore drill quarterly into an isolated environment. It takes a few hours, it is genuinely boring, and it is the only thing that converts backup status from a guess into a fact.",
                'days_ago' => 67,
            ],
            [
                'category' => 'Engineering',
                'title' => 'Legacy systems: rewrite or retire?',
                'excerpt' => 'A rewrite carries more risk than almost any alternative. Retirement is usually the better first option.',
                'image' => '/images/posts/legacy-rewrite-or-retire.svg',
                'body' => "When a legacy system becomes painful, the instinct is to rewrite it. Rewrites are the highest-risk project type in software, and the failure mode is predictable: the old behaviour nobody documented is discovered in month nine.\n\nBefore committing to a rewrite, ask whether the system can be retired. How many genuinely active users does it have? What does it integrate with that is still valuable?\n\nOften the honest answer is to strangle it: route new work elsewhere, keep it running untouched, and migrate one process at a time. This is slower than a rewrite on paper and considerably faster in practice.",
                'days_ago' => 90,
            ],
            [
                'category' => 'Cloud',
                'title' => 'Infrastructure as code, without the ceremony',
                'excerpt' => 'If your platform engineers spend more time on the deployment pipeline than the product, the tooling has overtaken the team.',
                'image' => '/images/posts/infrastructure-as-code.svg',
                'body' => "Infrastructure as code started as a way to stop clicking through consoles. It has a tendency to grow into a platform engineering programme with its own roadmap.\n\nThe signal that it has grown too far: the pipeline takes longer to change than the application it deploys.\n\nStart with the infrastructure that is genuinely painful to recreate. Version control the network and the core services, describe the rest in documentation, and resist building abstractions for problems you have not hit yet.",
                'days_ago' => 120,
            ],
        ];

        foreach ($posts as $post) {
            Post::query()->updateOrCreate(
                ['title' => $post['title']],
                [
                    'category_id' => $categoryIds[$post['category']],
                    'user_id' => $authorId,
                    'slug' => Str::slug($post['title']),
                    'excerpt' => $post['excerpt'],
                    'body' => $post['body'],
                    'image' => $post['image'],
                    'is_published' => true,
                    'published_at' => now()->subDays($post['days_ago']),
                ]
            );
        }
    }
}