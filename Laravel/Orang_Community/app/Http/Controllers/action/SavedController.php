<?php

namespace App\Http\Controllers\action;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SavedPost;

class SavedController extends Controller
{
    // Function to save or unsave a post
   // Function to save or unsave a post
public function save(Request $request, $post_id, $user_id)
{
    // Check if the user already saved this post
    $saved = SavedPost::where('post_id', $post_id)
                      ->where('user_id', $user_id)
                      ->first();

    if ($saved) {
        // If the post is already saved, remove the save
        $saved->delete();

        // Get the updated saved posts count
        $savedCount = SavedPost::where('post_id', $post_id)->count();

        return response()->json([
            'message' => 'Post unsaved successfully.',
            'isSaved' => false, // Return false because the post is now unsaved
            'savedCount' => $savedCount
        ], 200);
    } else {
        // If the post is not saved, create a new save
        SavedPost::create([
            'post_id' => $post_id,
            'user_id' => $user_id,
        ]);

        // Get the updated saved posts count
        $savedCount = SavedPost::where('post_id', $post_id)->count();

        return response()->json([
            'message' => 'Post saved successfully.',
            'isSaved' => true, // Return true because the post is now saved
            'savedCount' => $savedCount
        ], 200);
    }
}

// Function to display saved posts for a user
public function displaySaved(Request $request, $user_id)
{
    // Fetch saved posts by the user, including related data
    $savedPosts = SavedPost::where('user_id', $user_id)
        ->with([
            'post' => function ($query) {
                $query->with([
                    'user:id,full_name,image',
                    'comments:id,user_id,post_id,content',
                    'postImages:id,post_id,image',
                    'likes'
                ]);
            }
        ])
        ->get();

    // Map the data for the response to format it accordingly
    $response = $savedPosts->map(function ($savedPost) {
        // Add full URLs for post images
        if ($savedPost->post->postImages) {
            $savedPost->post->postImages->each(function ($image) {
                $image->image_url = url('uploads/temp/' . $image->image);
            });
        }

        // Add profile image URL to the user
        if ($savedPost->post->user && $savedPost->post->user->image) {
            $savedPost->post->user->profile_image_url = url('uploads/profile/' . $savedPost->post->user->image);
        }

        // Return the necessary fields
        return [
            'save_id' => $savedPost->id,
            'post_id' => $savedPost->post->id,
            'post_content' => $savedPost->post->content,
            'post_user' => $savedPost->post->user,
            'post_comments' => $savedPost->post->comments,
            'post_images' => $savedPost->post->postImages,
            'likes' => $savedPost->post->likes,
        ];
    });

    return response()->json([
        'message' => 'Display saved posts successfully',
        'data' => $response,
    ]);
}

// Function to check if a post is saved by the user
public function checkSavedStatus(Request $request, $post_id)
{
    $user_id = $request->query('user_id'); // Get user_id from query parameters
    
    // Check if the user has saved the post
    $saved = SavedPost::where('post_id', $post_id)
                      ->where('user_id', $user_id)
                      ->exists();

    return response()->json([
        'message' => 'Saved status retrieved successfully',
        'isSaved' => $saved
    ]);
}

}
