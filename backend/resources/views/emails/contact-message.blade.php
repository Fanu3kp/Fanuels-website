<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>New website enquiry</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; color: #1e293b; line-height: 1.6;">
<h2 style="margin-bottom: 4px;">New service request from {{ $contactMessage->name }}</h2>
    <p style="margin-top: 0; color: #64748b;">Received {{ $contactMessage->created_at->format('j M Y, H:i') }}</p>

    @if ($requestReference)
        <p style="margin: 8px 0 0; color: #334155;">
            <strong>Request Reference:</strong> <code style="background:#e2e8f0;padding:2px 6px;border-radius:4px;">{{ $requestReference }}</code>
        </p>
    @endif

    @if ($serviceTitle)
        <p style="margin: 4px 0 0; color: #334155;"><strong>Service:</strong> {{ $serviceTitle }}</p>
    @elseif ($contactMessage->type)
        <p style="margin: 4px 0 0; color: #334155;"><strong>Service:</strong> {{ $contactMessage->type }}</p>
    @endif

    <table cellpadding="8" cellspacing="0" border="0" style="border-collapse: collapse; width: 100%; max-width: 560px;">
        <tr>
            <td style="background: #f1f5f9; width: 120px; font-weight: bold;">Name</td>
            <td>{{ $contactMessage->name }}</td>
        </tr>
        @if ($contactMessage->company)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold;">Company</td>
                <td>{{ $contactMessage->company }}</td>
            </tr>
        @endif
        <tr>
            <td style="background: #f1f5f9; font-weight: bold;">Email</td>
            <td><a href="mailto:{{ $contactMessage->email }}">{{ $contactMessage->email }}</a></td>
        </tr>
        @if ($contactMessage->phone)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold;">Phone</td>
                <td>{{ $contactMessage->phone }}</td>
            </tr>
        @endif
        @if ($contactMessage->type)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold;">Order type</td>
                <td>{{ $contactMessage->type }}</td>
            </tr>
        @endif
        @if ($contactMessage->quantity)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold;">Quantity</td>
                <td>{{ $contactMessage->quantity }}</td>
            </tr>
        @endif
        @if ($contactMessage->team_size)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold;">Team size</td>
                <td>{{ $contactMessage->team_size }}</td>
            </tr>
        @endif
        @if ($contactMessage->timeline)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold;">Timeline</td>
                <td>{{ $contactMessage->timeline }}</td>
            </tr>
        @endif
@if ($contactMessage->subject)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold;">Subject</td>
                <td>{{ $contactMessage->subject }}</td>
            </tr>
        @endif
        @if ($contactMessage->budget)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold;">Budget</td>
                <td>{{ $contactMessage->budget }}</td>
            </tr>
        @endif
        @if ($contactMessage->usage_scale)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold;">Usage scale</td>
                <td>{{ $contactMessage->usage_scale }}</td>
            </tr>
        @endif
        @if ($contactMessage->hosting_preference)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold;">Hosting preference</td>
                <td>{{ $contactMessage->hosting_preference }}</td>
            </tr>
        @endif
        @if ($contactMessage->integration_scope)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold;">Integration scope</td>
                <td>{{ $contactMessage->integration_scope }}</td>
            </tr>
        @endif
        @if ($contactMessage->compliance_needs)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold;">Compliance needs</td>
                <td>{{ $contactMessage->compliance_needs }}</td>
            </tr>
        @endif
        @if ($contactMessage->platform_preference)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold;">Platform preference</td>
                <td>{{ $contactMessage->platform_preference }}</td>
            </tr>
        @endif
        @if ($contactMessage->deployment_model)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold;">Deployment model</td>
                <td>{{ $contactMessage->deployment_model }}</td>
            </tr>
        @endif
        @if ($contactMessage->nda_required)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold;">NDA required</td>
                <td>Yes</td>
            </tr>
        @endif
        @if ($contactMessage->existing_system)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold;">Existing system</td>
                <td>{{ $contactMessage->existing_system }}</td>
            </tr>
        @endif
        @if ($contactMessage->data_volume)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold;">Data volume</td>
                <td>{{ $contactMessage->data_volume }}</td>
            </tr>
        @endif
@if ($contactMessage->dynamic_data && count($contactMessage->dynamic_data) > 0)
            @foreach ($contactMessage->dynamic_data as $key => $value)
                @if (is_array($value))
                    @foreach ($value as $subKey => $subValue)
                        <tr>
                            <td style="background: #f1f5f9; font-weight: bold;">{{ ucfirst(str_replace('_', ' ', $subKey)) }}</td>
                            <td>{{ is_array($subValue) ? json_encode($subValue) : $subValue }}</td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td style="background: #f1f5f9; font-weight: bold;">{{ ucfirst(str_replace('_', ' ', $key)) }}</td>
                        <td>{{ $value }}</td>
                    </tr>
                @endif
            @endforeach
        @endif
        @if ($contactMessage->attachments && count($contactMessage->attachments) > 0)
            <tr>
                <td style="background: #f1f5f9; font-weight: bold; vertical-align: top;">Attachments</td>
                <td>
                    <ul style="margin: 0; padding-left: 18px;">
                        @foreach ($contactMessage->attachments as $attachment)
                            <li>{{ $attachment['name'] }} ({{ round($attachment['size'] / 1024) }} KB)</li>
                        @endforeach
                    </ul>
                </td>
            </tr>
        @endif
        <tr>
            <td style="background: #f1f5f9; font-weight: bold; vertical-align: top;">Details</td>
            <td>{!! nl2br(e($contactMessage->message)) !!}</td>
        </tr>
    </table>

    <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
        Sent from {{ config('app.name') }} &middot; reference IP {{ $contactMessage->ip_address ?? 'unknown' }}
    </p>
</body>
</html>



