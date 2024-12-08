<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ActController;
use App\Http\Controllers\NavController;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\action\LikeController;
use App\Http\Controllers\action\SavedController;
use App\Http\Controllers\landingPage\PostController;
use App\Http\Controllers\landingPage\UserController;
use App\Http\Controllers\landingPage\CommentController;


Route::post('register', [ApiController::class, 'register']);
Route::post('login', [ApiController::class, 'login']);
Route::group([
    'middleware' => ["auth:sanctum"]
], function(){
    Route::get('profile' , action: [ApiController::class , 'profile']);
    Route::get('profile', [ProfileController::class, 'show']);
    Route::post('/profile/edit', action: [ProfileController::class, 'updateProfile']);
    Route::get('/search-users', [UserController::class, 'searchUsers']);
    Route::post('comments', [CommentController::class, 'store']);
    Route::get('/nav/user-details', [NavController::class, 'getUserDetails']);
    Route::get("activities", [ActController::class, 'getActivities']);
    Route::get('logout' , [ApiController::class , 'logout']);

    

});

// routes/api.php
Route::post('/like/{post_id}/{user_id}', [LikeController::class, 'like']);
Route::get('/display/{user_id}', [LikeController::class, 'display']);
Route::get('/check-like/{id}', [LikeController::class, 'checkLike']);

Route::post('/save/{post_id}/{user_id}', [SavedController::class, 'save']);
Route::get('/display-saved/{user_id}', [SavedController::class, 'displaySaved']);
Route::get('/check-saved/{post_id}', [SavedController::class, 'checkSavedStatus']);



Route::post('comments', [CommentController::class, 'store']);
Route::get("index", [PostController::class, 'index']);
Route::post("posts/share", [PostController::class, 'share']);
Route::get('/posts/{postId}', [PostController::class, 'show']);
