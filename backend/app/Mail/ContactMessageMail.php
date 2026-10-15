<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessageMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $contactMessage) {}

    public function envelope(): Envelope
    {
        $subject = $this->contactMessage->request_reference
            ? 'New service request '.$this->contactMessage->request_reference.' from '.$this->contactMessage->name
            : 'New order from '.$this->contactMessage->name;

        return new Envelope(
            subject: $subject,
            replyTo: [$this->contactMessage->email],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact-message',
            with: [
                'requestReference' => $this->contactMessage->request_reference,
                'serviceTitle' => $this->contactMessage->service_title,
                'serviceSlug' => $this->contactMessage->service_slug,
            ],
        );
    }
}