<?php

namespace App\Http\Controllers\action;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Like;



class LikeController extends Controller
{
    public function like(Request $request, $id)
    {
    $user_id = 3;
    
    // Check if the user already liked this post
    $like = Like::where('post_id', $id)
                ->where('user_id', $user_id)
                ->first();



    if ($like) {
        $like->delete();

        $likesCount = Like::where('post_id', $id)->count();

        return response()->json([
            'message' => 'Unliked the post',
            'isLiked' => false, // Return false because the post is now unliked
            'likesCount' => $likesCount


        ], 200);
    } else {


        Like::create([
            'post_id' => $id,
            'user_id' => $user_id,
        ]);

        $likesCount = Like::where('post_id', $id)->count();

        return response()->json([
            'message' => 'Liked the post',
            'isLiked' => true, // Return true because the post is now liked
            'likesCount' => $likesCount


        ], 200);
    }
    }


    
    public function display($user_id)
    {
        // Example: Replace with the actual user ID in a real application
        // $user_id = auth()->id();
        $user_id =3;
    
        $likedPosts = Like::where('user_id', $user_id)
            ->with([
                'post' => function ($query) {
                    $query->with([
                        'user:id,full_name',
                        'comments:id,user_id,post_id,content',
                        'postImages:id,post_id,image' // Include postImages relationship
                    ]);
                }
            ])
            ->get();
    
        // Map the data for the response
        $response = $likedPosts->map(function ($like) {
            return [
                'like_id' => $like->id,
                'post_id' => $like->post->id,
                'post_content' => $like->post->content,
                'post_user' => $like->post->user,
                'post_comments' => $like->post->comments,
                'post_images' => $like->post->postImages, // Include postImages in the response
                'likes' => $like->post->likes, // Include all likes for the post


            ];
        });
    
        return response()->json([
            'message' => 'Display liked posts successfully',
            'data' => $response,
        ]);
    }

    public function checkLike($postId)
{
    $user_id = 3; // Replace with actual user authentication
    
    $like = Like::where('post_id', $postId)
                ->where('user_id', $user_id)
                ->exists();
    
    return response()->json([
        'message'=>'is exist',
        'isLiked' => $like
    ]);
}
    
    
}

