<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use App\Models\Setting;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class HomeController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'projects_completed' => Project::query()->published()->count(),
            'services_offered' => Service::query()->active()->count(),
            'team_members' => TeamMember::query()->active()->count(),
            'articles_published' => Post::query()->published()->count(),
        ]);
    }

    public function settings(): JsonResponse
    {
        return response()->json(Cache::remember('site_settings', 300, fn () => Setting::map()));
    }
}