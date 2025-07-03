<?php

namespace App\Http\Controllers\Auth;


use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
public function register(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|unique:users,email|unique:admins,email',
        'password' => 'required|string|min:6|confirmed',
        'account_type' => 'required|in:Customer,Seller',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // ✅ validate image
    ]);

    $data = [
        'full_name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
    ];

    // ✅ Upload image if exists
  if ($request->hasFile('image')) {
    $image = $request->file('image');
    $filename = uniqid() . '.' . $image->getClientOriginalExtension();
    $data['image'] = $image->storeAs('users', $filename, 'public');
}

    if ($validated['account_type'] === "Seller") {
        $data['type']="S";
        $user = Admin::create($data);
        Auth::guard('Admin')->login($user);
    } else {
       $data['type']="C";
        $user = User::create($data);
        Auth::login($user);
    }

    // session(['user' => $user]);

    return response()->json([
        'message' => 'User registered successfully.',
        'user' => $user
    ], 201);
}

public function login(LoginRequest $request)
{
    $remember_me = $request->has('remember_me');
    $email = $request->input("email");
    $pass = $request->input("password");

    // Try admin login
    if (Auth::guard('Admin')->attempt(['email' => $email, 'password' => $pass], $remember_me)) {
        $admin = Auth::guard('Admin')->user();
        session([
            'admin_logged_in' => true,
            'admin_id' => $admin->id,
            'admin_name' => $admin->full_name,
            'admin_type' => $admin->type,
            'admin_email' => $admin->email,
            'admin_image' => $admin->image
        ]);

        return response()->json([
            'message' => 'Admin logged in successfully.',
            'role' => session('admin_type'),
            'session' => session()->only([
                'admin_logged_in',
                'admin_id',
                'admin_name',
                'admin_type',
                'admin_email',
                'admin_image'
            ])
        ], 200);
    }

    // Try customer login
    if (Auth::guard('web')->attempt(['email' => $email, 'password' => $pass], $remember_me)) {
        $customer = Auth::guard('web')->user();
        session([
            'customer_logged_in' => true,
            'customer_id' => $customer->id,
            'customer_name' => $customer->full_name,
            'customer_type' => $customer->type,
            'customer_email' => $customer->email,
            'customer_image' => $customer->image
        ]);

        return response()->json([
            'message' => 'Customer logged in successfully.',
            'role' => 'customer',
            'session' => session()->only([
                'customer_logged_in',
                'customer_id',
                'customer_name',
                'customer_type',
                'customer_email',
                'customer_image'
            ])
        ], 200);
    }
//   \Log::info('Session after login:', session()->all());

    return response()->json(['message' => 'Invalid credentials.'], 401);
}



public function logout(Request $request)
{
    if (Auth::guard('admin')->check()) {
        Auth::guard('admin')->logout();
    } elseif (Auth::guard('web')->check()) {
        Auth::guard('web')->logout(); // for customers
    }

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json(['message' => 'Invalid credentials.'], 401);
}

}