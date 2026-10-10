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
            $table->string('request_reference', 32)->nullable()->after('id');
            $table->string('service_slug', 120)->nullable()->after('request_reference');
            $table->string('service_title', 255)->nullable()->after('service_slug');
            $table->json('attachments')->nullable()->after('dynamic_data');
            $table->string('budget', 50)->nullable()->after('attachments');
            $table->string('usage_scale', 50)->nullable()->after('budget');
            $table->string('hosting_preference', 50)->nullable()->after('usage_scale');
            $table->string('integration_scope', 50)->nullable()->after('hosting_preference');
            $table->string('compliance_needs', 50)->nullable()->after('integration_scope');
            $table->string('platform_preference', 50)->nullable()->after('compliance_needs');
            $table->string('deployment_model', 50)->nullable()->after('platform_preference');
            $table->boolean('nda_required')->default(false)->after('deployment_model');
            $table->string('existing_system', 255)->nullable()->after('nda_required');
            $table->string('data_volume', 50)->nullable()->after('existing_system');

            $table->index(['request_reference']);
            $table->index(['service_slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropColumn([
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
            ]);
        });
    }
};