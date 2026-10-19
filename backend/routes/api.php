<?php

use App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ProcessStepController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:10,1')->group(function () {
    Route::post('contact', [ContactController::class, 'store']);
    Route::post('login', [AuthController::class, 'login'])->name('login');
});

Route::get('home/stats', [HomeController::class, 'stats']);
Route::get('settings', [HomeController::class, 'settings']);

Route::get('services', [ServiceController::class, 'index']);
Route::get('services/{slug}', [ServiceController::class, 'show']);

Route::get('search', [SearchController::class, '__invoke']);

Route::get('projects', [ProjectController::class, 'index']);
Route::get('projects/{slug}', [ProjectController::class, 'show']);

Route::get('posts', [PostController::class, 'index']);
Route::get('posts/{slug}', [PostController::class, 'show']);

Route::get('categories', [CategoryController::class, 'index']);

Route::get('team', [TeamController::class, 'index']);
Route::get('testimonials', [TestimonialController::class, 'index']);

Route::get('process', [ProcessStepController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('services', [Admin\ServiceController::class, 'index']);
        Route::post('services', [Admin\ServiceController::class, 'store']);
        Route::put('services/{service}', [Admin\ServiceController::class, 'update']);
        Route::delete('services/{service}', [Admin\ServiceController::class, 'destroy']);

        Route::get('projects', [Admin\ProjectController::class, 'index']);
        Route::post('projects', [Admin\ProjectController::class, 'store']);
        Route::put('projects/{project}', [Admin\ProjectController::class, 'update']);
        Route::delete('projects/{project}', [Admin\ProjectController::class, 'destroy']);

        Route::get('posts', [Admin\PostController::class, 'index']);
        Route::post('posts', [Admin\PostController::class, 'store']);
        Route::put('posts/{post}', [Admin\PostController::class, 'update']);
        Route::delete('posts/{post}', [Admin\PostController::class, 'destroy']);

        Route::get('categories', [Admin\CategoryController::class, 'index']);
        Route::post('categories', [Admin\CategoryController::class, 'store']);
        Route::put('categories/{category}', [Admin\CategoryController::class, 'update']);
        Route::delete('categories/{category}', [Admin\CategoryController::class, 'destroy']);

        Route::get('team', [Admin\TeamMemberController::class, 'index']);
        Route::post('team', [Admin\TeamMemberController::class, 'store']);
        Route::put('team/{teamMember}', [Admin\TeamMemberController::class, 'update']);
        Route::delete('team/{teamMember}', [Admin\TeamMemberController::class, 'destroy']);

        Route::get('testimonials', [Admin\TestimonialController::class, 'index']);
        Route::post('testimonials', [Admin\TestimonialController::class, 'store']);
        Route::put('testimonials/{testimonial}', [Admin\TestimonialController::class, 'update']);
        Route::delete('testimonials/{testimonial}', [Admin\TestimonialController::class, 'destroy']);

        Route::get('messages', [Admin\ContactMessageController::class, 'index']);
        Route::get('messages/unread-count', [Admin\ContactMessageController::class, 'unreadCount']);
        Route::patch('messages/{contactMessage}/read', [Admin\ContactMessageController::class, 'markRead']);
        Route::delete('messages/{contactMessage}', [Admin\ContactMessageController::class, 'destroy']);

        Route::get('settings', [Admin\SettingController::class, 'index']);
        Route::put('settings', [Admin\SettingController::class, 'update']);
        Route::put('settings/bulk', [Admin\SettingController::class, 'bulkUpdate']);
    });
});