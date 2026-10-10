<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = [
        'name',
        'company',
        'email',
        'phone',
        'subject',
        'message',
        'dynamic_data',
        'type',
        'quantity',
        'team_size',
        'timeline',
        'request_reference',
        'service_slug',
        'service_title',
        'attachments',
        'budget',
        'usage_scale',
        'hosting_preference',
        'integration_scope',
        'compliance_needs',
        'platform_preference',
        'deployment_model',
        'nda_required',
        'existing_system',
        'data_volume',
        'ip_address',
        'is_read',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'nda_required' => 'boolean',
            'dynamic_data' => 'array',
            'attachments' => 'array',
        ];
    }

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }
}