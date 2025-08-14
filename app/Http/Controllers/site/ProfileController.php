<?php

namespace App\Http\Controllers\site;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
class ProfileController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::guard('admin')->user() ?? Admin::find(session('admin_id'));
    
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            // 'state'      => 'required|string|max:255',
            // 'gender'     => 'required|string|max:255',
            'address'    => 'required|string|max:255',
            'email'      => 'required|email|unique:admins,email,' . $user->id,
            'password'   => 'nullable|string|min:6|confirmed',
            'image'      => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'Birth_date' => 'required|date',
            'phone'      => 'required|string|max:255',
        ]);
    
        $user->full_name  = $validated['name'];
        $user->email      = $validated['email'];
        // $user->state      = $validated['state'];
        // $user->gender     = $validated['gender'];
        $user->address    = $validated['address'];
        $user->Birth_date = $validated['Birth_date'];
        $user->phone      = $validated['phone'];
    
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
    
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = uniqid() . '.' . $image->getClientOriginalExtension();
            $user->image = $image->storeAs('users', $filename, 'public');
        }
    
        $user->save();
    
        // Update session
        session([
            'admin_logged_in' => true,
            'admin_id'        => $user->id,
            'admin_name'      => $user->full_name,
            'admin_type'      => $user->type,
            'admin_email'     => $user->email,
            'admin_image'     => $user->image,
            'admin_gender'    => $user->gender,
            'admin_state'     => $user->state,
            'admin_address'   => $user->address,
            'admin_date'      => $user->Birth_date,
            'admin_phone'     => $user->phone,
        ]);
    
        return response()->json([
            'message' => 'Admin updated successfully.',
            'role'    => session('admin_type'),
            'session' => session()->only([
                'admin_logged_in',
                'admin_id',
                'admin_name',
                'admin_type',
                'admin_email',
                'admin_image',
                'admin_state',
                'admin_address',
                'admin_gender',
                'admin_date',
                'admin_phone'
            ])
        ], 200);
    }
    


public function changePass(Request $request)
{
    $user = Auth::guard('admin')->user() ?? Admin::find(session('admin_id'));

    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $validated = $request->validate([
        'password'   => 'nullable|string|min:6|confirmed',
    ]);


    if (!empty($validated['password'])) {
        $user->password = Hash::make($validated['password']);
    }

    $user->save();

    // Update session
    session([
        'admin_logged_in' => true,
        'admin_id'        => $user->id,
        'admin_name'      => $user->full_name,
        'admin_type'      => $user->type,
        'admin_email'     => $user->email,
        'admin_image'     => $user->image,
        'admin_gender'    => $user->gender,
        'admin_state'     => $user->state,
        'admin_address'   => $user->address,
        'admin_date'      => $user->Birth_date,
        'admin_phone'     => $user->phone,
    ]);

    return response()->json([
        'message' => 'Admin updated successfully.',
        'role'    => session('admin_type'),
        'session' => session()->only([
            'admin_logged_in',
            'admin_id',
            'admin_name',
            'admin_type',
            'admin_email',
            'admin_image',
            'admin_state',
            'admin_address',
            'admin_gender',
            'admin_date',
            'admin_phone'
        ])
    ], 200);
}


}