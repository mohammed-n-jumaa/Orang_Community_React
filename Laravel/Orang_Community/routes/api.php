<?php

use App\Http\Controllers\ActivityController as ControllersActivityController;
use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\landingPage\PostController;
use App\Http\Controllers\ActController;
use App\Http\Controllers\action\LikeController;
use App\Http\Controllers\action\SavedController;
use App\Http\Controllers\landingPage\CommentController;
use App\Http\Controllers\landingPage\UserController;
use App\Http\Controllers\NavController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });




Route::post('register' , [ApiController::class , 'register']);

Route::post('login' , [ApiController::class , 'login']);

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

Route::post('/like/{id}', [LikeController::class, 'like']);
Route::get('/display/{user_id}', [LikeController::class, 'display']);
Route::get('/check-like/{id}', [LikeController::class, 'checkLike']);

Route::post('/save/{id}', [SavedController::class, 'saved']);
Route::get('/show/{user_id}', [SavedController::class, 'show']);
Route::get('/check-saved/{id}', [SavedController::class, 'checkSavedStatus']);



Route::post('comments', [CommentController::class, 'store']);
Route::get("index", [PostController::class, 'index']);
Route::post("posts/share", [PostController::class, 'share']);
Route::get('/posts/{postId}', [PostController::class, 'show']);
