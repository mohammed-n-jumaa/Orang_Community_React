<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ApiController extends Controller
{
    public function register(Request $request)
    {
        // Validation including full_name (if required)
        $request->validate([

            'full_name' => 'required|string',  // Add validation for full_name
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
        ]);

        // Create user and include full_name field
        User::create([

            'full_name' => $request->full_name ,// Add full_name field here
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'User registered successfully'
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
            if (Hash::check($request->password, $user->password)) {
                $token = $user->createToken('myToken')->plainTextToken;

                return response()->json([
                    'status' => true,
                    'message' => 'Login successful',
                    'token' => $token,
                    'user' => [ // Use '=>' instead of ':'
                        'id' => 1,
                        'name' => 'John Doe',
                        'email' => 'john.doe@example.com',
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
            'message' => 'Invalid login'
        ]);
    }

    public function profile()
    {
        $data = auth()->user();  // Get the currently authenticated user
        return response()->json([
            'status' => true,
            'message' => 'Profile data',
            'user' => $data
        ]);
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();  // Revoke all tokens of the user

        return response()->json([
            'status' => true,
            'message' => 'User logged out'
        ]);
    }
}

