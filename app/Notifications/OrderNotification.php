<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Models\Order;

class OrderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'order_id'   => $this->order->id,
            'total'      => $this->order->total_price,
            'status'     => $this->order->status,
            'buyer_id'   => $this->order->user_id,
            'items'      => $this->order->items->map(function ($item) {
                return [
                    'product_id' => $item->product_id,
                    'product'    => $item->product->name ?? 'N/A',
                    'quantity'   => $item->quantity,
                    'total'      => $item->total_price,
                    'created_by' => $item->product->created_by,
                ];
            }),
            'text' => "New Order #{$this->order->id} placed by User {$this->order->user_id}", // 👈 added
        ];
    }
    
}
