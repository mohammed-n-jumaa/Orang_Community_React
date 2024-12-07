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
        // Get posts along with relationships
        $postcount = Post::withCount(['likes', 'comments'])->get();
        $posts = Post::with([
            'user:id,full_name,image', // Include profile_image column from users table
            'comments:id,user_id,post_id,content',
            'likes:id,post_id,user_id',
            'postImages:id,post_id,image',
        ])
        ->withCount([
            'likes', // This will add a likes_count attribute to each post
            'comments' // This will add a comments_count attribute to each post
        ])
        ->latest()
        ->get();

        // Add full URLs for post images
        $posts->each(function ($post) {
            // Add the full URL for each post image
            if ($post->postImages) {
                $post->postImages->each(function ($image) {
                    $image->image_url = url('uploads/temp/' . $image->image); // Construct full URL for post images
                });
            }

            // Add profile image URL to the user
            if ($post->user && $post->user->image) {
                $post->user->profile_image_url = url('uploads/profile/' . $post->user->image); // Construct full URL for user profile image
            }
        });

        return response()->json([
            'success' => true,
            'data' => $posts,
            
        ], 200);
    }

    


    // Store post
    public function share(Request $request)
{
    $user_id = $request->user_id; 

    

    $request->validate([
        'content' => 'required|string',
        'images.*' => 'nullable|image|mimes:jpg,png,jpeg,gif|max:10240', // Validate multiple images
    ]);

    // Create the post
    $post = Post::create([
        'user_id' => $user_id,
        'content' => $request->content,
    ]);

    // Handle multiple images if provided
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $image) {
            $ext = $image->getClientOriginalExtension(); // Get file extension
            $imageName = time() . '_' . uniqid() . '.' . $ext;

            // Save the image details in PostImage
            $tempImage = new PostImage();
            $tempImage->post_id = $post->id; // Associate with the newly created post
            $tempImage->image = $imageName;
            $tempImage->save();

            // Move the file to the uploads directory
            $image->move(public_path('uploads/temp'), $imageName);
        }
    }

    return response()->json(['success' => true, 'post' => $post], 200);
}


public function show($postId)
{
    // Retrieve the post along with its relationships
    $post = Post::with([
        'user:id,full_name,image', // Include profile_image column from users table
        'comments' => function ($query) {
            $query->with('user:id,full_name,image') // Include user details for comments
                  ->latest(); // Order comments by latest
        },
        'likes:id,post_id,user_id',
        'postImages:id,post_id,image' // Include post images
    ])->findOrFail($postId);

    // Construct full URLs for images
    if ($post->postImages) {
        $post->postImages->each(function ($image) {
            $image->image_url = url('uploads/temp/' . $image->image); // Add full URL for post images
        });
    }

    // Add profile image URL to the user
    if ($post->user && $post->user->image) {
        $post->user->profile_image_url = url('uploads/profile/' . $post->user->image); // Add full URL for user profile image
    }

    // Add profile image URL for each comment's user
    if ($post->comments) {
        $post->comments->each(function ($comment) {
            if ($comment->user && $comment->user->image) {
                $comment->user->profile_image_url = url('uploads/profile/' . $comment->user->image); // Add full URL for comment user profile image
            }
        });
    }

    return response()->json([
        'success' => true,
        'data' => $post
    ], 200);
}



}