<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('client')->nullable();
            $table->text('summary');
            $table->longText('body')->nullable();
            $table->json('technologies')->nullable();
            $table->string('cover_image')->nullable();
            $table->json('gallery')->nullable();
            $table->string('project_url')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(false);
            $table->date('completed_at')->nullable();
            $table->timestamps();

            $table->index('is_published');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};