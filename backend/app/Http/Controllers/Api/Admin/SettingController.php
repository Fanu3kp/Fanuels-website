<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Setting::map());
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'key' => ['required', 'string', 'max:100'],
            'value' => ['nullable', 'string', 'max:5000'],
        ]);

        Setting::put($data['key'], $data['value']);
        Cache::forget('site_settings');

        return response()->json(Setting::map());
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'settings' => ['required', 'array', 'min:1'],
            'settings.*.key' => ['required', 'string', 'max:100'],
            'settings.*.value' => ['nullable', 'string', 'max:5000'],
        ]);

        foreach ($data['settings'] as $entry) {
            Setting::put($entry['key'], $entry['value']);
        }

        Cache::forget('site_settings');

        return response()->json(Setting::map());
    }
}