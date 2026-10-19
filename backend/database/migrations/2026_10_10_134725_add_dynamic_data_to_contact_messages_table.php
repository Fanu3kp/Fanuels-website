<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->json('dynamic_data')->nullable()->after('message');
            $table->string('company', 255)->nullable()->after('name');
            $table->string('team_size', 50)->nullable()->after('quantity');
            $table->string('timeline', 50)->nullable()->after('team_size');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropColumn(['dynamic_data', 'company', 'team_size', 'timeline']);
        });
    }
};
