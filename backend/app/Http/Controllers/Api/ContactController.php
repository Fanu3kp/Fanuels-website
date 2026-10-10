<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactMessageMail;
use App\Models\ContactMessage;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ContactController extends Controller
{
    /**
     * Allowed upload extensions and max sizes (bytes).
     */
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/msword',
        'text/plain',
        'application/zip',
    ];

    private const MAX_FILE_SIZE = 5_242_880; // 5 MB

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            'dynamic_data' => ['nullable', 'array'],
            'type' => ['nullable', 'string', 'max:50'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:9999'],
            'team_size' => ['nullable', 'string', 'max:50'],
            'timeline' => ['nullable', 'string', 'max:50'],
            'request_reference' => ['nullable', 'string', 'max:32'],
            'service_slug' => ['nullable', 'string', 'max:120'],
            'service_title' => ['nullable', 'string', 'max:255'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => ['file', 'mimes:jpeg,png,gif,webp,pdf,docx,xls,xlsx,doc,txt,zip', 'max:5120'],
            'budget' => ['nullable', 'string', 'max:50'],
            'usage_scale' => ['nullable', 'string', 'max:50'],
            'hosting_preference' => ['nullable', 'string', 'max:50'],
            'integration_scope' => ['nullable', 'string', 'max:50'],
            'compliance_needs' => ['nullable', 'string', 'max:50'],
            'platform_preference' => ['nullable', 'string', 'max:50'],
            'deployment_model' => ['nullable', 'string', 'max:50'],
            'nda_required' => ['nullable', 'boolean'],
            'existing_system' => ['nullable', 'string', 'max:255'],
            'data_volume' => ['nullable', 'string', 'max:50'],
        ]);

        $data['ip_address'] = $request->ip();

        // Honeypot: bots fill hidden inputs, humans never see them.
        if (filled($request->input('website'))) {
            return response()->json(['message' => 'Thanks, your order has been received.'], 201);
        }

        // Generate a unique request reference number.
        $data['request_reference'] = $this->generateReference();

        // Persist uploaded attachments into storage and record metadata.
        $attachments = [];
        foreach ($request->file('attachments', []) as $file) {
            $path = $file->store('contact-attachments', 'public');
            $attachments[] = [
                'name' => $file->getClientOriginalName(),
                'path' => $path,
                'size' => $file->getSize(),
                'mime' => $file->getMimeType(),
                'uploaded_at' => now()->toIso8601String(),
            ];
        }
        $data['attachments'] = $attachments ?: null;

        // Normalise boolean flag.
        $data['nda_required'] = (bool) ($data['nda_required'] ?? false);

        $contactMessage = ContactMessage::query()->create($data);

        $recipient = trim((string) Setting::get('contact_email'));
        if ($recipient === '') {
            $recipient = (string) config('mail.from.address');
        }

        try {
            Mail::to($recipient)->send(new ContactMessageMail($contactMessage));
        } catch (\Throwable $e) {
            Log::warning('Contact notification email failed.', [
                'message_id' => $contactMessage->id,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'message' => 'Thanks, your request has been received.',
            'reference' => $contactMessage->request_reference,
            'id' => $contactMessage->id,
        ], 201);
    }

    private function generateReference(): string
    {
        $prefix = 'REQ';
        $date = now()->format('ymd');
        $attempts = 0;

        do {
            $random = Str::upper(Str::random(5));
            $reference = "{$prefix}-{$date}-{$random}";
            $attempts++;
            if ($attempts > 10) {
                $reference = "{$prefix}-{$date}-" . Str::upper(Str::random(6));
                break;
            }
        } while (ContactMessage::query()->where('request_reference', $reference)->exists());

        return $reference;
    }
}