<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Project extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'client',
        'summary',
        'body',
        'technologies',
        'cover_image',
        'gallery',
        'project_url',
        'sort_order',
        'is_featured',
        'is_published',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'technologies' => 'array',
            'gallery' => 'array',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'completed_at' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Project $project) {
            if (blank($project->slug)) {
                $project->slug = Str::slug($project->title);
            }
        });
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderByDesc('completed_at')->orderBy('id');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}