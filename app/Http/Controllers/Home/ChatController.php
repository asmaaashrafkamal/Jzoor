<?php

namespace App\Http\Controllers\Home;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use App\Models\ChatMessage;

class ChatController extends Controller
{
    
    public function adminChat(Request $request, $adminId)
    {
        $customerId = $request->input('customer_id');
        // dd($customerId);
        $messages = ChatMessage::where(function ($q) use ($adminId, $customerId) {
            $q->where('sender_id', $customerId)->where('receiver_id', $adminId);
        })->orWhere(function ($q) use ($adminId, $customerId) {
            $q->where('sender_id', $adminId)->where('receiver_id', $customerId);
        })->orderBy('created_at')->get();
    
        return response()->json(['messages' => $messages]);
    }
    
    
    
    public function sendMessage(Request $request)
    {
        $request->validate([
            'sender_id' => 'required|integer',
            'receiver_id' => 'required|integer',
            'sender_type' => 'required|string',
            'receiver_type' => 'required|string',
            'message' => 'required|string',
        ]);
    
        $message = ChatMessage::create([
            'sender_id' => $request->sender_id,
            'receiver_id' => $request->receiver_id,
            'sender_type' => $request->sender_type ?? 'driver',
            'receiver_type' => $request->receiver_type ?? 'user',
            'message' => $request->message,
        ]);
    
        return response()->json(['success' => true, 'data' => $message]);
    }
   
    public function getReceivedMessages()
    {
            $user = Auth::user();
            $userId = $user->id;
            $userType = strtolower($user->type); // 'c' or 'd'
            $userType = $userType === 'c' ? 'user' : 'driver';
            // Fetch all messages where the user is either sender or receiver
            $messages = ChatMessage::with(['sender', 'receiver'])
                ->where(function ($query) use ($userId, $userType) {
                    $query->where('sender_id', $userId)
                          ->where('sender_type', $userType);
                })
                // ->orWhere(function ($query) use ($userId, $userType) {
                //     $query->where('receiver_id', $userId)
                //           ->where('receiver_type', $userType);
                // })
                ->latest()
                ->get();
        
            return response()->json([
                'status' => true,
                'data' => $messages->map(function ($msg) {
                    return [
                        'sender_id'     => $msg->sender_id,
                        'sender_type'   => $msg->sender_type,
                        'sender_name'   => $msg->sender->full_name ?? 'Unknown',
                        'sender_avatar' => asset('storage/' . ($msg->sender->image ?? 'default.png')),
        
                        'receiver_id'     => $msg->receiver_id,
                        'receiver_type'   => $msg->receiver_type,
                        'receiver_name'   => $msg->receiver->full_name ?? 'Unknown',
                        'receiver_avatar' => asset('storage/' . ($msg->receiver->image ?? 'default.png')),
        
                        'message'      => $msg->message,
                        'created_at'   => $msg->created_at->toDateTimeString(),
                    ];
                }),
            ]);
        }
        
    

    
  
}
