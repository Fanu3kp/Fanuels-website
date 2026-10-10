<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PostController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Post::query()->with(['category:id,name,slug', 'author:id,name'])->latest()->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $data['user_id'] = $request->user()->id;

        return response()->json(Post::query()->create($data), 201);
    }

    public function update(Request $request, Post $post): JsonResponse
    {
        $post->update($this->validated($request, $post));

        return response()->json($post->fresh()->load(['category:id,name,slug', 'author:id,name']));
    }

    public function destroy(Post $post): JsonResponse
    {
        $post->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request, ?Post $post = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('posts', 'slug')->ignore($post?->id)],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'body' => ['required', 'string'],
            'image' => ['nullable', 'string', 'max:255'],
            'is_published' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ]);
    }
}