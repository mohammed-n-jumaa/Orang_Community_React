<?php

namespace App\Http\Controllers\landingPage;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User; // Ensure you are importing the correct model

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
        $users->transform(function ($user) {
            if ($user->image) {
                // Assuming images are saved in the 'public/uploads/temp' folder
                $user->image = asset('uploads/temp/' . $user->image);
            }
            return $user;
        });

        return response()->json([
            'success' => true,
            'data' => $users
        ], 200);
    }
}