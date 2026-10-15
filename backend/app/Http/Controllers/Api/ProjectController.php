<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Project::query()->published();

        if ($request->boolean('featured')) {
            $query->featured();
        }

        $perPage = min((int) $request->integer('per_page', 12), 50);

        $projects = $query->ordered()->paginate($perPage);

        return response()->json($projects);
    }

    public function show(string $slug): JsonResponse
    {
        $project = Project::query()->published()->where('slug', $slug)->firstOrFail();

        return response()->json($project);
    }
}