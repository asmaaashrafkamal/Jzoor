<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ReviewNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $review;

    public function __construct($review)
    {
        $this->review = $review;
    }

    // 👇 REQUIRED
    public function via($notifiable)
    {
        return ['database']; // you can also add 'mail' if needed
    }

    public function toArray($notifiable)
    {
        return [
            'review_id'   => $this->review->id,
            'product_id'  => $this->review->product->id ?? null,
            'product_name'=> $this->review->product->name ?? 'N/A',
            'created_by'  => $this->review->product->created_by ?? 'N/A',
            'rating'      => $this->review->rating,
            'review'      => $this->review->review,
            'user_id'     => $this->review->user_id,
            'text'        => "New review on {$this->review->product->name}: {$this->review->review}", // 👈 added
        ];
    }
    
}
