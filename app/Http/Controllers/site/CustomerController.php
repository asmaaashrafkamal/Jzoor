<?php

namespace App\Http\Controllers\site;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
class CustomerController extends Controller
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
            'role' => 'admin',
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

    return response()->json(['message' => 'logout successfully'], 200);
}
public function get_customer()
{
    return User::with('orders')->get();
}
public function customer_update(Request $request, $id)
{
    $request->validate([
        'full_name' => 'required|string|max:255',
        'phone'     => 'required|string',
        'status'    => 'nullable|string',
    ]);

    $user = User::findOrFail($id);
    $user->full_name = $request->full_name;
    $user->phone = $request->phone;
    $user->save();

    return response()->json(['message' => 'Customer updated successfully']);
}

public function customer_destroy($id)
{
    $user = User::with('orders')->findOrFail($id);

    // Check if any order has status 'Pick Up' or 'In Transit'
    $hasRestrictedStatus = $user->orders->contains(function ($order) {
        $status = strtolower($order->status);
        return $status === 'picked up' || $status === 'in transit';
    });

    if ($hasRestrictedStatus) {
        return response()->json([
            'error' => 'Cannot delete user with orders in "Pick Up" or "In Transit" status'
        ], 403);
    }

    // Optional: delete user's non-restricted orders too
    // $user->orders()->delete();

    $user->delete();

    return response()->json(['message' => 'User deleted successfully']);
}
public function monthlyCustomers()
{
    // Start with 12 months initialized to 0
    $months = collect(range(1, 12))->mapWithKeys(fn($m) => [$m => 0]);

    // Query actual counts
    $users = User::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
        ->whereYear('created_at', now()->year)
        ->groupBy('month')
        ->pluck('count', 'month');

    // Replace zeros with actual counts
    $monthlyCounts = $months->map(function ($value, $month) use ($users) {
        return $users[$month] ?? 0;
    });

    return response()->json($monthlyCounts->values());
}



public function stats()
{
    $totalCustomers = User::count();
    $newCustomersLast7Days = User::where('created_at', '>=', now()->subDays(7))->count();
    $visitors = 250000; // Optional: Replace with real logic if needed

    return response()->json([
        'totalCustomers' => [
            'value' => number_format($totalCustomers),
            'change' => '14.4%', // Optional: calculate vs previous period
            'isPositive' => true
        ],
        'newCustomers' => [
            'value' => number_format($newCustomersLast7Days),
            'change' => '20%',
            'isPositive' => true
        ],
        'visitors' => [
            'value' => '250k', // hardcoded or calculate
            'change' => '20%',
            'isPositive' => true
        ],
    ]);
}


}
