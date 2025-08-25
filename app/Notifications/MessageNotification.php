<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class MessageNotification extends Notification
{
    use Queueable;

    protected $messageText;
    protected $fromUser;

    public function __construct($messageText, $fromUser)
    {
        $this->messageText = $messageText;
        $this->fromUser = $fromUser;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => "New message from {$this->fromUser}: {$this->messageText}",
            'time' => now()->toDateTimeString(),
        ];
    }
}
