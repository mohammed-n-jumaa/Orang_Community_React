<?php

namespace App\Http\Controllers\landingPage;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostImage; // Import PostImage model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with([
    'user:id,full_name',
    'comments:id,user_id,post_id,content',
    'likes:id,post_id,user_id',
    'postImages:id,post_id,image'  // Fetch all columns of the postImages table
])
->latest()
->get();

        return response()->json([
            'success' => true,
            'data' => $posts
        ], 200);
    }

    // Store post
    public function share(Request $request)
    
    
    {
        $user_id = 1; // Get the authenticated user
        $request->validate([
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,png,jpeg,gif|max:10240', // Validate image
        ]);
    
        // Create the post
        $post = Post::create([
            'user_id' => $user_id,
            'content' => $request->content,
        ]);
    
        // If an image is uploaded
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts_images', 'public'); // Store in 'public/posts_images' directory
    
            // Save the image path to the database
            PostImage::create([
                'post_id' => $post->id,
                'image' => $imagePath,
            ]);
        }
    
        return response()->json(['success' => true, 'post' => $post], 200);
    }
}