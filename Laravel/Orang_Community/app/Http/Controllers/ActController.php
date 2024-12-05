<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Http\Request;

class ActController extends Controller
{
    public function getActivities()
    {
        // Fetch activities (posts and comments for example)
        $posts = Post::with('user')->latest()->take(10)->get();
        $comments = Comment::with('user')->latest()->take(10)->get();

        // Combine posts and comments into one collection
        $activities = $posts->map(function ($post) {
            return [
                'user' => $post->user,
                'description' => 'posted a new status: ' . $post->content,
                'createdAt' => $post->created_at,
            ];
        })->merge(
            $comments->map(function ($comment) {
                return [
                    'user' => $comment->user,
                    'description' => 'commented on a post: ' . $comment->content,
                    'createdAt' => $comment->created_at,
                ];
            })
        );

        // Sort activities by the created date
        $activities = $activities->sortByDesc('createdAt');

        return response()->json($activities);
    }
}