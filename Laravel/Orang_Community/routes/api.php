<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\landingPage\PostController;
use App\Http\Controllers\landingPage\CommentController;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\ActController;

Route::post('register', [ApiController::class, 'register']);
Route::post('login', [ApiController::class, 'login']);
Route::group([
    'middleware' => ["auth:sanctum"]
], function() {
    Route::get('profile', [ProfileController::class, 'show']);
    Route::get("index", [PostController::class, 'index']);
    Route::post("posts/share", [PostController::class, 'share']);
    Route::post('comments', [CommentController::class, 'store']);
    Route::post('/profile/edit', [ProfileController::class, 'updateProfile']);
        Route::get('logout', [ApiController::class, 'logout']);
        Route::get("activities", action: [ActController::class, 'getActivities']);

});
