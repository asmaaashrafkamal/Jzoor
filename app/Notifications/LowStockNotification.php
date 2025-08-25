<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LowStockNotification extends Notification
{
    use Queueable;

    protected $productName;
    protected $stock;

    public function __construct($productName, $stock,$created_by)
    {
        $this->productName = $productName;
        $this->stock = $stock;
        $this->created_by = $created_by;

    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => [
                'product_name' => $this->productName,
                'stock' => $this->stock,
                'created_by' => $this->created_by,
            ],
            'time' => now()->toDateTimeString()
        ];
    }
}
