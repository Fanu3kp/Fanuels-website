<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Project::query()->ordered()->get());
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json(Project::query()->create($this->validated($request)), 201);
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        $project->update($this->validated($request, $project));

        return response()->json($project->fresh());
    }

    public function destroy(Project $project): JsonResponse
    {
        $project->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request, ?Project $project = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('projects', 'slug')->ignore($project?->id)],
            'client' => ['nullable', 'string', 'max:255'],
            'summary' => ['required', 'string', 'max:1000'],
            'body' => ['nullable', 'string'],
            'technologies' => ['nullable', 'array'],
            'technologies.*' => ['string', 'max:100'],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['string', 'max:255'],
            'project_url' => ['nullable', 'url', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['nullable', 'boolean'],
            'is_published' => ['nullable', 'boolean'],
            'completed_at' => ['nullable', 'date'],
        ]);
    }
}