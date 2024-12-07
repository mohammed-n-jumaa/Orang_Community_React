<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NavController extends Controller
{
    public function getUserDetails()
    {
        // Hardcoding the user with id = 3
        $user = (object) [
            'id' => 3,
            'full_name' => 'Zaid', // Example full name
            'image' => '1733507146_6753384af24ff.jfif', // Example image name
        ];

        // Return user details, including image path
        return response()->json([
            'data' => [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'image' => $user->image ? url('uploads/profile/' . $user->image) : null, // Construct image URL
            ],
        ]);
    }
}


// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth;

// class NavController extends Controller
// {
// public function getUserDetails()
// {
// // Get the currently authenticated user
// $user = auth()->id;

// if ($user) {
// // Return user details, including image path
// return response()->json([
// 'data' => [
// 'id' => $user->id,
// 'full_name' => $user->full_name,
// 'image' => $user->image ? url('uploads/profile/' . $user->image) : null, // Construct image URL
// ],
// ]);
// }

// return response()->json(['message' => 'User not authenticated'], 401);
// }
// }