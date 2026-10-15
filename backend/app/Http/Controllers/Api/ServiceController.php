<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    public function index(): JsonResponse
    {
        $services = Service::query()->active()->ordered()->get();

        return response()->json($services);
    }

    public function show(string $slug): JsonResponse
    {
        $service = Service::query()->active()->where('slug', $slug)->firstOrFail();

        return response()->json($service);
    }
}