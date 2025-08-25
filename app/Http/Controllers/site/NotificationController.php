<?php

namespace App\Http\Controllers\site;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    // ✅ Get all notifications
    public function index()
    {
        return response()->json(DatabaseNotification::latest()->get());
    }

    public function Sindex()
    {
        // $adminId = Auth::guard('admin')->id();
        $adminId  =session('admin_id');
        $allNotifications = DatabaseNotification::latest()->get();
    
        $notifications = $allNotifications->filter(function ($notification) use ($adminId) {
            $data = $notification->data;
    
        // حالة LowStockNotification
        if ($notification->type === "App\\Notifications\\LowStockNotification") {
            if (isset($data['message']['created_by']) && $data['message']['created_by'] == $adminId) {
                return true;
            }
        }
            // الحالة 1: created_by مباشرة
            if (isset($data['created_by']) && $data['created_by'] == $adminId) {
                return true;
            }
    
            // الحالة 2: موجود داخل items
            if (isset($data['items']) && is_array($data['items'])) {
                foreach ($data['items'] as $item) {
                    if (isset($item['created_by']) && $item['created_by'] == $adminId) {
                        return true;
                    }
                }
            }
    
            return false;
        })->values();
    
        return response()->json($notifications);
    }
    
    
    
    // ✅ Store new notification
    public function store(Request $request)
    {
        $request->validate([
            'title'   => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $notification = Notification::create($request->all());

        return response()->json($notification, 201);
    }

    public function markAsRead($id)
    {
        $notification = DatabaseNotification::find($id);

        if (!$notification) {
            return response()->json(['error' => 'Notification not found'], 404);
        }

        $notification->markAsRead();
        return response()->json(['success' => true]);
    }

    public function markAllAsRead()
    {
        auth()->user()->unreadNotifications->markAsRead();
        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $notification = DatabaseNotification::find($id);
        if (!$notification) {
            return response()->json(['error' => 'Notification not found'], 404);
        }
        $notification->delete();
        return response()->json(['success' => true]);
    }
}
