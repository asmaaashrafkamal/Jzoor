<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = [
        'sender_id',
        'sender_type',
        'receiver_id',
        'receiver_type',
        'message',
    ];

    // Polymorphic relation to sender (can be User, Admin, Driver, etc.)
    public function sender()
    {
        return $this->morphTo(__FUNCTION__, 'sender_type', 'sender_id');
    }

    // Polymorphic relation to receiver (can be User, Admin, Driver, etc.)
    public function receiver()
    {
        return $this->morphTo(__FUNCTION__, 'receiver_type', 'receiver_id');
    }
}


