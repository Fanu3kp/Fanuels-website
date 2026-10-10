<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Category::query()->orderBy('name')->get());
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json(Category::query()->create($this->validated($request)), 201);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $category->update($this->validated($request, $category));

        return response()->json($category->fresh());
    }

    public function destroy(Category $category): JsonResponse
    {
        $category->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request, ?Category $category = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('categories', 'slug')->ignore($category?->id)],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);
    }
}