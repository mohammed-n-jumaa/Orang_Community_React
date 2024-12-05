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
    $user_id = 1; 

    // Check if the user already liked this post
    $like = Like::where('post_id', $id)
                ->where('user_id', $user_id)
                ->first();

    if ($like) {
        $like->delete();

        $likes_count = Like::where('post_id', $id)->count();

        return response()->json([
            'message' => 'Unliked the post',
            'likes_count' => $likes_count,
        ], 200);
    } else {


        Like::create([
            'post_id' => $id,
            'user_id' => $user_id,
        ]);

        $likes_count = Like::where('post_id', $id)->count();

        return response()->json([
            'message' => 'Liked the post',
            'likes_count' => $likes_count,
        ], 200);
    }
    }


    
    public function display($user_id)
    {
        $user_id = 2;

        $likes = Like::where('user_id', $user_id)
                    ->with('post') 
                    ->get();


        // Map data to response format
        $response = $likes->map(function ($like) {
            return [
                'like_id' => $like->id,
                'post_id' => $like->post_id,
                'post_content' => $like->post->content ?? 'No content available',
            ];
        });

        return response()->json([
            'message' => 'Display posts successfully',
            'data' => $response,
        ]);
    }

}

