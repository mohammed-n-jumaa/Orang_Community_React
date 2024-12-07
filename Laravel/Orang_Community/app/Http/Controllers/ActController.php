<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;

class ActController extends Controller
{
    public function getActivities()
    {
        // Fetch posts and comments with related data
        $posts = Post::with(['user:id,full_name,image', 'postImages:id,post_id,image'])
            ->latest()
            ->take(10)
            ->get();
        
        $comments = Comment::with(['user:id,full_name,image'])
            ->latest()
            ->take(10)
            ->get();

        // Map posts to activity format
        $postActivities = $posts->map(function ($post) {
            return [
                'user' => [
                    'name' => $post->user->full_name,
                    'profile_image_url' => $post->user->image 
                        ? url('uploads/profile/' . $post->user->image) 
                        : null,
                ],
                'description' => 'posted a new status: ' . $post->content,
                'images' => $post->postImages->map(function ($image) {
                    return url('uploads/temp/' . $image->image);
                }),
                'createdAt' => $post->created_at,
            ];
        });

        // Map comments to activity format
        $commentActivities = $comments->map(function ($comment) {
            return [
                'user' => [
                    'name' => $comment->user->full_name,
                    'profile_image_url' => $comment->user->image 
                        ? url('uploads/profile/' . $comment->user->image) 
                        : null,
                ],
                'description' => 'commented on a post: ' . $comment->content,
                'createdAt' => $comment->created_at,
            ];
        });

        // Merge and sort activities
        $activities = $postActivities->merge($commentActivities)
            ->sortByDesc('createdAt')
            ->values(); // Reset keys for JSON response

        return response()->json([
            'success' => true,
            'activities' => $activities,
        ]);
    }
}