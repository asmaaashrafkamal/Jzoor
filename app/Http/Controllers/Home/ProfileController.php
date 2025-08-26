<?php

namespace App\Http\Controllers\Home;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class ProfileController extends Controller
{
public function store(Request $request)
{
    $user = auth()->user() ?? User::find(session('user')->customer_id);

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
        'image' => 'nullable',
        'Birth_date' => 'required|date',
        'phone' => 'required|string|max:255',
    ]);

    // Update basic fields
    $user->full_name   = $validated['name'];
    $user->email       = $validated['email'];
    $user->state       = $validated['state'];
    $user->gender      = $validated['gender'];
    $user->address     = $validated['address'];
    $user->Birth_date  = $validated['Birth_date'];
    $user->phone       = $validated['phone'];

    // Update password only if provided
    if (!empty($validated['password'])) {
        $user->password = Hash::make($validated['password']);
    }

    // Update image if uploaded
    if ($request->hasFile('image')) {
        $image = $request->file('image');
        $filename = uniqid() . '.' . $image->getClientOriginalExtension();
        $user->image = $image->storeAs('users', $filename, 'public');
    }

    $user->save();

    // ✅ Update session after user saved
  $customer = Auth::guard('web')->user();
        session([
            'customer_logged_in' => true,
            'customer_id' => $customer->id,
            'customer_name' => $customer->full_name,
            'customer_type' => $customer->type,
            'customer_email' => $customer->email,
            'customer_image' => $customer->image,
            'customer_gender' => $customer->gender,
            'customer_state' => $customer->state,
            'customer_address' => $customer->address,
            'customer_date' => $customer->Birth_date,
            'customer_phone' => $customer->phone,

        ]);

        return response()->json([
            'status' => 'updated successfully.',
            'role' => session('customer_type'),
            'session' => session()->only([
                'customer_logged_in',
                'customer_id',
                'customer_name',
                'customer_type',
                'customer_email',
                'customer_image',
                'customer_gender',
                'customer_address',
                'customer_state',
                'customer_date',
                'customer_phone'
            ])
        ], 200);

}

public function getUser()
{
    $userSession = session('user');

    if (!$userSession) {
        return response()->json(['message' => 'Not logged in'], 401);
    }

    return response()->json([
        'user' => $userSession
    ]);
}


}
