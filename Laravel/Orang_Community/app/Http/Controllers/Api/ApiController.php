<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class ApiController extends Controller
{
    public function __construct()
    {
        // Protect the profile and logout routes with Sanctum authentication
        $this->middleware('auth:sanctum')->only(['profile', 'logout']);
    }

    public function register(Request $request)
    {
        // Validation including full_name (if required)
        $request->validate([
            'full_name' => 'required|string',  // Add validation for full_name
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed|min:8', // Add password length validation
        ]);

        // Create user and include full_name field
        $user = User::create([
            'full_name' => $request->full_name, // Add full_name field here
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Return response with user data (excluding sensitive password)
        return response()->json([
            'status' => true,
            'message' => 'User registered successfully',
            'user' => [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'email' => $user->email,
            ],
        ]);
    }

    public function login(Request $request)
    {
        // Validation for login
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            // Check if password matches
            if (Hash::check($request->password, $user->password)) {
                // Create token
                $token = $user->createToken('myToken')->plainTextToken;

                return response()->json([
                    'status' => true,
                    'message' => 'Login successful',
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'full_name' => $user->full_name, // Corrected field name
                        'email' => $user->email,
                    ],
                ]);
            }
            return response()->json([
                'status' => false,
                'message' => 'Password did not match'
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Invalid login credentials'
        ]);
    }

    public function profile()
    {
        // Get the currently authenticated user
        $data = auth()->user();

        return response()->json([
            'status' => true,
            'message' => 'Profile data',
            'user' => $data
        ]);
    }

    // public function logout()
    // {
    //     // Revoke all tokens for the authenticated user
    //     auth()->user()->tokens()->delete();

    //     return response()->json([
    //         'status' => true,
    //         'message' => 'User logged out successfully'
    //     ]);
    // }
}
