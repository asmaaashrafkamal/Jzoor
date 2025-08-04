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
    
    public function adminChatDelivery(Request $request, $userId)
    {
        $customerId = $request->input('delivery_id');
        // dd($customerId);
        $messages = ChatMessage::where(function ($q) use ($userId, $customerId) {
            $q->where('sender_id', $customerId)->where('receiver_id', $userId);
        })->orWhere(function ($q) use ($userId, $customerId) {
            $q->where('sender_id', $userId)->where('receiver_id', $customerId);
        })->orderBy('created_at')->get();
    
        return response()->json(['messages' => $messages]);
    }
    
    public function sendMessageDelivery(Request $request)
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
        $userType = strtolower($user->type) === 'c' ? 'user' : 'driver';
    
        // Get all messages involving the user (as sender or receiver)
        $messages = ChatMessage::with(['sender', 'receiver'])
            ->where(function ($query) use ($userId, $userType) {
                $query->where('receiver_id', $userId)
                      ->where('receiver_type', $userType);
            })
            ->orWhere(function ($query) use ($userId, $userType) {
                $query->where('sender_id', $userId)
                      ->where('sender_type', $userType);
            })
            ->latest()
            ->get();
    
        // Group by other participant (contact)
        $grouped = $messages->groupBy(function ($msg) use ($userId, $userType) {
            if ($msg->sender_id == $userId && $msg->sender_type == $userType) {
                return $msg->receiver_type . '-' . $msg->receiver_id;
            } else {
                return $msg->sender_type . '-' . $msg->sender_id;
            }
        });
    
        // Get latest message per contact
        $contacts = $grouped->map(function ($msgs) use ($userId, $userType) {
            $latest = $msgs->first();
    
            $isSender = $latest->sender_id == $userId && $latest->sender_type == $userType;
            $other = $isSender ? $latest->receiver : $latest->sender;
    
            return [
                'id'          => $other->id,
                'type'        => $isSender ? $latest->receiver_type : $latest->sender_type,
                'name'        => $other->full_name ?? 'Unknown',
                'avatar'      => asset('storage/' . ($other->image ?? 'default.png')),
                'lastMessage' => $latest->message,
                'time'        => $latest->created_at->toDateTimeString(),
                'unread'      => $msgs->where('receiver_id', $userId)
                                      ->where('receiver_type', $userType)
                                      ->where('is_read', false)
                                      ->count(),
            ];
        })->values();
    
        return response()->json([
            'status' => true,
            'data'   => $contacts,
        ]);
    }
    
        public function getReceivedMessagesDelivery()
        {
            $admin = Auth::guard('admin')->user();
            $adminId = $admin->id;
            $adminType = strtolower($admin->type) === 'c' ? 'user' : 'driver';
            
            // Get all messages involving the admin
            $messages = ChatMessage::with(['sender', 'receiver'])
                ->where(function ($query) use ($adminId, $adminType) {
                    $query->where('receiver_id', $adminId)
                          ->where('receiver_type', $adminType);
                })
                ->orWhere(function ($query) use ($adminId, $adminType) {
                    $query->where('sender_id', $adminId)
                          ->where('sender_type', $adminType);
                })
                ->latest()
                ->get();
            
            // Group by contact ID (the *other* participant)
            $grouped = $messages->groupBy(function ($msg) use ($adminId, $adminType) {
                if ($msg->sender_id == $adminId && $msg->sender_type == $adminType) {
                    return $msg->receiver_type . '-' . $msg->receiver_id;
                } else {
                    return $msg->sender_type . '-' . $msg->sender_id;
                }
            });
            
            // Get the latest message per contact
            $contacts = $grouped->map(function ($msgs) use ($adminId, $adminType) {
                $latest = $msgs->first();
            
                $isSender = $latest->sender_id == $adminId && $latest->sender_type == $adminType;
                $other = $isSender ? $latest->receiver : $latest->sender;
            
                return [
                    'id'         => $other->id,
                    'type'       => $isSender ? $latest->receiver_type : $latest->sender_type,
                    'name'       => $other->full_name ?? 'Unknown',
                    'avatar'     => asset('storage/' . ($other->image ?? 'default.png')),
                    'lastMessage'=> $latest->message,
                    'time'       => $latest->created_at->toDateTimeString(),
                    // Optional:
                    'unread'     => $msgs->where('receiver_id', $adminId)
                                         ->where('receiver_type', $adminType)
                                         ->where('is_read', false)->count(),
                ];
            })->values();
            
            return response()->json([
                'status' => true,
                'data'   => $contacts,
            ]);
            
            }
            
    
  
}
