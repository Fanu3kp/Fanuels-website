<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('process_steps', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('step_number');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('summary');
            $table->longText('body')->nullable();
            $table->string('icon', 100)->nullable();
            $table->string('image')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('process_steps');
    }
};
