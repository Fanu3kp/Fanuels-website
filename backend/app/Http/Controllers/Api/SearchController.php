<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $term = $request->string('q')->trim()->toString();

        if ($term === '') {
            return response()->json([
                'query' => '',
                'total' => 0,
                'results' => [],
            ]);
        }

        $results = [];

        $services = Service::query()
            ->active()
            ->where(function ($q) use ($term) {
                $q->where('title', 'like', "%{$term}%")
                    ->orWhere('summary', 'like', "%{$term}%")
                    ->orWhere('body', 'like', "%{$term}%")
                    ->orWhere('slug', 'like', "%{$term}%");
            })
            ->ordered()
            ->limit(5)
            ->get();

        foreach ($services as $service) {
            $results[] = $this->formatResult('service', $service);
        }

        $projects = Project::query()
            ->published()
            ->where(function ($q) use ($term) {
                $q->where('title', 'like', "%{$term}%")
                    ->orWhere('summary', 'like', "%{$term}%")
                    ->orWhere('body', 'like', "%{$term}%")
                    ->orWhere('client', 'like', "%{$term}%")
                    ->orWhere('slug', 'like', "%{$term}%");
            })
            ->ordered()
            ->limit(5)
            ->get();

        foreach ($projects as $project) {
            $results[] = $this->formatResult('project', $project);
        }

        $posts = Post::query()
            ->published()
            ->with('category:id,name,slug')
            ->where(function ($q) use ($term) {
                $q->where('title', 'like', "%{$term}%")
                    ->orWhere('excerpt', 'like', "%{$term}%")
                    ->orWhere('body', 'like', "%{$term}%")
                    ->orWhere('slug', 'like', "%{$term}%");
            })
            ->latest()
            ->limit(5)
            ->get();

        foreach ($posts as $post) {
            $results[] = $this->formatResult('post', $post);
        }

        $team = TeamMember::query()
            ->active()
            ->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                    ->orWhere('role', 'like', "%{$term}%")
                    ->orWhere('bio', 'like', "%{$term}%")
                    ->orWhere('email', 'like', "%{$term}%");
            })
            ->ordered()
            ->limit(5)
            ->get();

        foreach ($team as $member) {
            $results[] = $this->formatResult('team', $member);
        }

        $results = array_merge($results, $this->staticPageResults($term));

        $results = $this->sortByRelevance($results, $term);

        return response()->json([
            'query' => $term,
            'total' => count($results),
            'results' => $results,
        ]);
    }

    protected function formatResult(string $type, $model): array
    {
        $routeMap = [
            'service' => '/services/{slug}',
            'project' => '/projects/{slug}',
            'post' => '/insights/{slug}',
        ];

        $route = $routeMap[$type];

        if ($type === 'service') {
            $summary = $model->summary ?: \Illuminate\Support\Str::limit(strip_tags((string) $model->body), 160);
            return [
                'type' => 'service',
                'id' => $model->id,
                'title' => $model->title,
                'slug' => $model->slug,
                'summary' => $summary,
                'route' => str_replace('{slug}', $model->slug, $route),
                'image' => $model->image,
            ];
        }

        if ($type === 'project') {
            return [
                'type' => 'project',
                'id' => $model->id,
                'title' => $model->title,
                'slug' => $model->slug,
                'summary' => $model->summary,
                'route' => str_replace('{slug}', $model->slug, $route),
                'image' => $model->cover_image,
                'client' => $model->client,
            ];
        }

        if ($type === 'team') {
            return [
                'type' => 'team',
                'id' => $model->id,
                'title' => $model->name,
                'slug' => '',
                'summary' => $model->role,
                'route' => '/about',
                'image' => $model->image,
                'role' => $model->role,
            ];
        }

        if ($type === 'post') {
            return [
                'type' => 'post',
                'id' => $model->id,
                'title' => $model->title,
                'slug' => $model->slug,
                'summary' => $model->excerpt,
                'route' => str_replace('{slug}', $model->slug, $route),
                'image' => $model->image,
                'published_at' => $model->published_at ? $model->published_at->format('Y-m-d') : null,
                'category' => $model->category ? $model->category->name : null,
                'author' => $model->author ? $model->author->name : null,
            ];
        }

        return [];
    }

    protected function staticPageResults(string $term): array
    {
        $term = strtolower($term);
        $pages = [
            ['label' => 'Home', 'route' => '/', 'keywords' => 'home landing start otuya global'],
            ['label' => 'About Us', 'route' => '/about', 'keywords' => 'about us company who we are fanuel otuya history mission vision team leadership careers'],
            ['label' => 'Services', 'route' => '/services', 'keywords' => 'services what we do digital transformation custom software erp cloud cybersecurity data analytics'],
            ['label' => 'Products', 'route' => '/products', 'keywords' => 'products otuya-pos otuya financials otuya insure otuya erp otuya crm software tools'],
            ['label' => 'Projects', 'route' => '/projects', 'keywords' => 'projects portfolio work case studies clients'],
            ['label' => 'Insights', 'route' => '/insights', 'keywords' => 'insights blog articles news posts'],
            ['label' => 'Business Units', 'route' => '/business', 'keywords' => 'business units branches poultry cattle chickens goats agriculture otuya foods otuya logistics'],
            ['label' => 'Structure', 'route' => '/structure', 'keywords' => 'structure organization units group chart'],
            ['label' => 'Careers', 'route' => '/careers', 'keywords' => 'careers jobs vacancies join team work hiring opportunities'],
            ['label' => 'FAQ', 'route' => '/faq', 'keywords' => 'faq frequently asked questions help support'],
            ['label' => 'Contact', 'route' => '/contact', 'keywords' => 'contact get in touch message us email phone support sales'],
            ['label' => 'Lab', 'route' => '/lab', 'keywords' => 'lab visual synthesis experimental playground'],
            ['label' => 'Privacy Policy', 'route' => '/privacy', 'keywords' => 'privacy policy data protection gdpr'],
            ['label' => 'Terms of Service', 'route' => '/terms', 'keywords' => 'terms service agreement conditions'],
            ['label' => 'Cookie Policy', 'route' => '/cookies', 'keywords' => 'cookie policy cookies'],
        ];

        $matches = [];
        foreach ($pages as $page) {
            $searchText = strtolower($page['label'] . ' ' . $page['keywords']);
            if (str_contains($searchText, $term)) {
                $matches[] = [
                    'type' => 'page',
                    'title' => $page['label'],
                    'slug' => $page['route'],
                    'summary' => '',
                    'route' => $page['route'],
                    'image' => null,
                ];
            }
        }

        return $matches;
    }

    protected function sortByRelevance(array $results, string $term): array
    {
        $term = strtolower($term);

        usort($results, function ($a, $b) use ($term) {
            $scoreA = $this->relevanceScore($a, $term);
            $scoreB = $this->relevanceScore($b, $term);
            return $scoreB <=> $scoreA;
        });

        return $results;
    }

    protected function relevanceScore(array $item, string $term): int
    {
        $score = 0;

        if (strtolower((string) $item['title']) === $term) {
            $score += 10;
        } elseif (str_contains(strtolower((string) $item['title']), $term)) {
            $score += 5;
        }

        if (str_contains(strtolower((string) ($item['summary'] ?? '')), $term)) {
            $score += 3;
        }

        return $score;
    }
}
