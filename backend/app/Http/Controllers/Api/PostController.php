<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Post::query()->published()->with('category:id,name,slug');

        if ($slug = $request->string('category')->toString()) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
        }

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        $perPage = min((int) $request->integer('per_page', 9), 50);

        return response()->json($query->latest()->paginate($perPage));
    }

    public function show(string $slug): JsonResponse
    {
        $post = Post::query()
            ->published()
            ->with(['category:id,name,slug', 'author:id,name,avatar'])
            ->where('slug', $slug)
            ->firstOrFail();

        $post->increment('views');

        return response()->json($post);
    }
}