<?php

namespace App\Http\Controllers\landingPage;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    public function searchUsers(Request $request)
    {
        $query = $request->input('query');

        // Search users by full_name, email, or socialmedia
        $users = User::where('full_name', 'LIKE', "%{$query}%")
            ->orWhere('email', 'LIKE', "%{$query}%")
            ->orWhere('socialmedia', 'LIKE', "%{$query}%")
            ->select('id', 'full_name', 'email', 'image', 'academy', 'socialmedia')
            ->get();

        // Modify image URL if exists
        $users->each(function ($user) {
            if ($user->image) {
                // Assuming images are stored in 'uploads/profile' folder
                $user->image_url = url('uploads/profile/' . $user->image);
            }
        });

        return response()->json([
            'success' => true,
            'data' => $users
        ], 200);
    }
}