<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(TeamMember::query()->ordered()->get());
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json(TeamMember::query()->create($this->validated($request)), 201);
    }

    public function update(Request $request, TeamMember $teamMember): JsonResponse
    {
        $teamMember->update($this->validated($request));

        return response()->json($teamMember->fresh());
    }

    public function destroy(TeamMember $teamMember): JsonResponse
    {
        $teamMember->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'image' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'x_url' => ['nullable', 'url', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }
}