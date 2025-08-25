<?php

namespace App\Console\Commands;
use App\Models\Admin;
use App\Models\Product;
use App\Notifications\LowStockNotification;
use Illuminate\Console\Command;

class CheckLowStock extends Command
{
    protected $signature = 'stock:check';
    protected $description = 'Notify admins of low stock products';

    public function handle()
    {
        $threshold = 5;
        $products = Product::where('stock_quantity', '<=', $threshold)->get();
    
        foreach ($products as $product) {
            if ($product->last_stock_quantity !== $product->stock_quantity) {
                
                // Notify using the product itself
                $product->notify(new LowStockNotification($product->name, $product->stock_quantity,$product->created_by));
    
                $product->last_low_stock_notification = now();
                $product->last_stock_quantity = $product->stock_quantity;
                $product->save();
    
                $this->info("Notified about {$product->name}");
            }
        }
    
        return Command::SUCCESS;
    }
    
}
