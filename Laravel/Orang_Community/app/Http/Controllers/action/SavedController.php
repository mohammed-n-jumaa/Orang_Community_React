<?php

namespace App\Http\Controllers\action;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SavedPost;

class SavedController extends Controller
{
    public function saved(Request $request, $id)
    {
        $userId = 3; // Static user ID for testing

        $saved = SavedPost::where('user_id', $userId)
        ->where('post_id', $id)
        ->first();

    if ($saved) {
        $saved->delete();
        return response()->json([
            'message' => 'Post unsaved successfully.',
            'status' => 'unsaved'
        ], 200);
    } else {
        SavedPost::create([
            'user_id' => $userId,
            'post_id' => $id,
        ]);
        return response()->json([
            'message' => 'Post saved successfully.',
            'status' => 'saved'
        ], 201);
    }
    }


    public function show($user_id)
    {
        // Example: Replace with the actual user ID in a real application
        // $user_id = auth()->id();
        $user_id =3;
    
        $savePosts = SavedPost::where('user_id', $user_id)
            ->with([
                'post' => function ($query) {
                    $query->with([
                        'user:id,full_name',
                        'comments:id,user_id,post_id,content',
                        'postImages:id,post_id,image', // Include postImages relationship
                        'likes' // Include the likes relationship

                    ]);
                }
            ])
            ->get();
    
        // Map the data for the response
        $response = $savePosts->map(function ($save) {
            return [
                'like_id' => $save->id,
                'post_id' => $save->post->id,
                'post_content' => $save->post->content,
                'post_user' => $save->post->user,
                'post_comments' => $save->post->comments,
                'post_images' => $save->post->postImages, // Include postImages in the response
                'likes' => $save->post->likes, // Include likes in the response


            ];
        });
    
        return response()->json([
            'message' => 'Display liked posts successfully',
            'data' => $response,
        ]);
    }

    public function checkSavedStatus($id) {
        $userId = 3; // Static user ID for testing
        $isSaved = SavedPost::where('user_id', $userId)
            ->where('post_id', $id)
            ->exists();
    
        return response()->json(['isSaved' => $isSaved]);
    }
    
}
