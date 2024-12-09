<?php

namespace App\Http\Controllers\action;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Like;



class LikeController extends Controller
{
    // app/Http/Controllers/LikeController.php
public function like(Request $request, $post_id, $user_id)
{
    // Check if the user already liked this post
    $like = Like::where('post_id', $post_id)
                ->where('user_id', $user_id)
                ->first();

    if ($like) {
        // If the post is already liked, remove the like
        $like->delete();

        // Get the updated likes count
        $likesCount = Like::where('post_id', $post_id)->count();

        return response()->json([
            'message' => 'Unliked the post',
            'isLiked' => false, // Return false because the post is now unliked
            'likesCount' => $likesCount
        ], 200);
    } else {
        // If the post is not liked, create a new like
        Like::create([
            'post_id' => $post_id,
            'user_id' => $user_id,
        ]);

        // Get the updated likes count
        $likesCount = Like::where('post_id', $post_id)->count();

        return response()->json([
            'message' => 'Liked the post',
            'isLiked' => true, // Return true because the post is now liked
            'likesCount' => $likesCount
        ], 200);
    }
}



    
public function display(Request $request, $user_id)
{
    // Fetch liked posts by the user, including related data
    $likedPosts = Like::where('user_id', $user_id)
        ->with([
            'post' => function ($query) {
                $query->with([
                    'user:id,full_name,image',
                    'comments:id,user_id,post_id,content',
                    'postImages:id,post_id,image'
                ]);
            }
        ])
        ->get();

    // Map the data for the response to format it accordingly
    $response = $likedPosts->map(function ($like) {
        // Add full URLs for post images
        if ($like->post->postImages) {
            $like->post->postImages->each(function ($image) {
                $image->image_url = url('uploads/temp/' . $image->image);
            });
        }

        // Add profile image URL to the user
        if ($like->post->user && $like->post->user->image) {
            $like->post->user->profile_image_url = url('uploads/profile/' . $like->post->user->image);
        }

        // Return the necessary fields
        return [
            'like_id' => $like->id,
            'post_id' => $like->post->id,
            'post_content' => $like->post->content,
            'post_user' => $like->post->user,
            'post_comments' => $like->post->comments,
            'post_images' => $like->post->postImages,
            'likes' => $like->post->likes,
        ];
    });

    return response()->json([
        'message' => 'Display liked posts successfully',
        'data' => $response,
    ]);
}


public function checkLike(Request $request, $postId)
{
    $user_id = $request->query('user_id'); // Get user_id from query parameters
    
    // Check if the user has already liked the post
    $like = Like::where('post_id', $postId)
                ->where('user_id', $user_id)
                ->exists();
    
    return response()->json([
        'message' => 'Like status retrieved successfully',
        'isLiked' => $like
    ]);
}

    
    
}

