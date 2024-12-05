<?php

namespace App\Http\Controllers\landingPage;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Store a comment for a specific post.
     */
    public function store(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id', // Ensure the post exists
            'content' => 'required|string|max:1000', // Validate the content
            'image' => 'nullable|image|mimes:jpg,png,jpeg,gif|max:10240', // Optional image
        ]);

        // Get the logged-in user's ID
        $user_id = 1;
        if (!$user_id) {
            return response()->json(['success' => false, 'message' => 'User not authenticated'], 401);
        }

        // Create a new comment
        $comment = new Comment();
        $comment->user_id = $user_id;
        $comment->post_id = $request->post_id;
        $comment->content = $request->content;

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('comments_images', 'public');
            $comment->image = $imagePath;
        }

        $comment->save();

        return response()->json([
            'success' => true,
            'comment' => $comment->load('user'), // Include user details for the frontend
        ], 201);
    }
}