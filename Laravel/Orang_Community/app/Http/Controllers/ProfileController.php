<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    // Fetch user profile data
    public function show(Request $request)
    {
        try {
            $user = $request->user();
            
            // جلب البوستات الخاصة باليوزر فقط
            $posts = $user->posts()->whereNull('deleted_at')->get();
    
            // إضافة التعليقات واللايكات لكل بوست
            foreach ($posts as $post) {
                $post->comments = $post->comments; // جلب التعليقات
                $post->likes_count = $post->likes()->count(); // جلب عدد اللايكات
                $post->time_ago = $this->timeElapsed($post->created_at); // الوقت المنقضي منذ نشر البوست
            }
    
            return response()->json([
                'id' => $user->id,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'academy' => $user->academy,
                'socialmedia' => $user->socialmedia,
                'profile_picture' => $user->image ? url('uploads/profile/' . $user->image) : null,
                'posts' => $posts // إضافة البوستات مع التفاصيل
            ]);
        } catch (\Exception $e) {
            Log::error('Profile Show Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    // دالة لحساب الوقت المنقضي منذ نشر البوست
    private function timeElapsed($timestamp)
    {
        $time_ago = strtotime($timestamp);
        $current_time = time();
        $time_difference = $current_time - $time_ago;
    
        $seconds = $time_difference;
        $minutes      = round($seconds / 60);           // value 60 is seconds
        $hours        = round($seconds / 3600);         // value 3600 is 60 minutes * 60 sec
        $days         = round($seconds / 86400);        // value 86400 is 24 hours * 60 minutes * 60 sec
        $weeks        = round($seconds / 604800);       // value 604800 is 7 days * 24 hours * 60 minutes * 60 sec
        $months       = round($seconds / 2629440);      // value 2629440 is (365*24*60*60)/12
        $years        = round($seconds / 31553280);     // value 31553280 is (365*24*60*60)
    
        if ($seconds <= 60) {
            return "Just Now";
        } else if ($minutes <= 60) {
            return "$minutes minutes ago";
        } else if ($hours <= 24) {
            return "$hours hours ago";
        } else if ($days <= 7) {
            return "$days days ago";
        } else if ($weeks <= 4.3) { // 4.3 == 30/7
            return "$weeks weeks ago";
        } else if ($months <= 12) {
            return "$months months ago";
        } else {
            return "$years years ago";
        }
    }
    
    

    // Update user profile
    public function updateProfile(Request $request)
    {
        Log::info('Update Profile Request Data:', $request->all());

        // Validate the incoming data
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:users,id',
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'academy' => 'required|string|max:255',
            'socialmedia' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'password' => 'nullable|string|min:6',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
                'message' => 'Validation failed'
            ], 400);
        }
    
        try {
            // Retrieve the user by ID
            $user = User::findOrFail($request->id);
    
            // Update user details
            $user->full_name = $request->full_name;
            $user->email = $request->email;
            $user->academy = $request->academy;
            $user->socialmedia = $request->socialmedia;
    
            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($user->image && file_exists(public_path('uploads/profile/' . $user->image))) {
                    unlink(public_path('uploads/profile/' . $user->image));
                }
                
                // Store new image
                $image = $request->file('image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploads/profile'), $imageName);
                $user->image = $imageName;
            }
    
            // Handle password update
            if ($request->filled('password')) {
                $user->password = bcrypt($request->password);
            }
    
            // Save the updated user details
            $user->save();
    
            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => [
                    'id' => $user->id,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                    'academy' => $user->academy,
                    'socialmedia' => $user->socialmedia,
                    'profile_picture' => $user->image ? url('uploads/profile/' . $user->image) : null,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Profile Update Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred while updating profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
