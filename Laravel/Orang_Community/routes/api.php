<?php

<<<<<<< HEAD
use App\Http\Controllers\ActivityController as ControllersActivityController;
=======
use App\Http\Controllers\Api\ApiController;
>>>>>>> 5043e3e10bcfeef6ea1e6855dcd0e7a7ae71f3b5
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\landingPage\PostController;
use App\Http\Controllers\ActController;

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
<<<<<<< HEAD
Route::get("index", [PostController::class, 'index']);
Route::post("posts/share", [PostController::class, 'share']);
Route::get("activities", [ActController::class, 'getActivities']);
Route::group([
    "middleware" => ["auth:sanctum"]
], function(){
    
});
=======

Route::post('register' , [ApiController::class , 'register']);

Route::post('login' , [ApiController::class , 'login']);

Route::group([
    'middleware' => ["auth:sanctum"]
], function(){
    Route::get('profile' , [ApiController::class , 'profile']);

    Route::get('logout' , [ApiController::class , 'logout']);
});

>>>>>>> 5043e3e10bcfeef6ea1e6855dcd0e7a7ae71f3b5