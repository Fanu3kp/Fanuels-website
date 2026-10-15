<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            ContactMessage::query()
                ->when($request->boolean('unread'), fn ($q) => $q->unread())
                ->latest()
                ->get()
        );
    }

    public function unreadCount(): JsonResponse
    {
        return response()->json(['count' => ContactMessage::query()->unread()->count()]);
    }

    public function markRead(ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->update(['is_read' => true]);

        return response()->json($contactMessage->fresh());
    }

    public function destroy(ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->delete();

        return response()->json(null, 204);
    }
}