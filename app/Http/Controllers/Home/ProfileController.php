<?php

namespace App\Http\Controllers\Home;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
public function store(Request $request)
{
    $user = auth()->user() ?? \App\Models\User::find(session('user')->customer_id);

    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'state' => 'required|string|max:255',
        'gender' => 'required|string|max:255',
        'address' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $user->id,
        'password' => 'nullable|string|min:6|confirmed',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        'Birth_date' => 'required|string|max:255',
        'phone' => 'required|string|max:255',
    ]);

    $user->full_name = $validated['name'];
    $user->email = $validated['email'];
    $user->state = $validated['state'];
    $user->gender = $validated['gender'];
    $user->address = $validated['address'];
    $user->Birth_date = $validated['Birth_date'];
    $user->phone = $validated['phone'];

    if (!empty($validated['password'])) {
        $user->password = Hash::make($validated['password']);
    }

    if ($request->hasFile('image')) {
        $image = $request->file('image');
        $filename = uniqid() . '.' . $image->getClientOriginalExtension();
        $user->image = $image->storeAs('users', $filename, 'public');
    }

    $user->save();
    session(['user' => $user]);

    return response()->json([
        'message' => 'User updated successfully.',
        'user' => $user
    ]);
}

}
