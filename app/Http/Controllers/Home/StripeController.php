<?php

namespace App\Http\Controllers\Home;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Models\Order;
use App\Models\Admin;
use App\Models\Product;
use App\Models\Order_Item;
use App\Models\Payment;
use App\Notifications\OrderNotification;


/* End of file ModelName.php */
use Stripe\Checkout\Session;
class StripeController extends Controller
{
    public function checkout(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'total' => 'required|numeric|min:0.01',
            'method' => 'required|in:cash,card',
            'payment_id' => 'nullable|string',
        ]);
    
        $userId = Auth::guard('web')->id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        // Create Order
        $order = Order::create([
            'user_id' => $userId,
            'total_price' => $request->total,
            'status' => $request->method === 'cash' ? 'Pending' : 'Shipped',
        ]);
    
        // Add Order Items
        foreach ($request->items as $item) {
            Order_Item::create([
                'order_id'   => $order->id,
                'product_id' => $item['id'],
                'quantity'   => $item['quantity'],
                'unit_price' => $item['price'],
                'total_price'=> $item['quantity'] * $item['price'],
            ]);
        }
    
        // Store Payment
        Payment::create([
            'order_id'       => $order->id,
            'payment_method' => $request->method,
            'payment_status' => $request->method === 'cash' ? 'pending' : 'paid',
            'transaction_id' => $request->payment_id,
            'paid_at'        => $request->method === 'card' ? now() : null,
        ]);
    
        // 🔔 Notify (with full order + items)
        $order->load('items.product'); // eager load relations
        // dd($order->toArray());
        auth()->user()->notify(new OrderNotification($order));
    
        return response()->json(['message' => 'Order placed successfully']);
    }
    

public function createPaymentIntent(Request $request)
{
    $userId = Auth::guard('web')->id();
    if (!$userId) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $request->validate([
        'amount' => 'required|numeric|min:1',
    ]);

    Stripe::setApiKey(env('STRIPE_SECRET'));

    try {
        $paymentIntent = PaymentIntent::create([
            'amount' => $request->amount,
            'currency' => 'usd',
            'automatic_payment_methods' => ['enabled' => true],
        ]);

        return response()->json(['clientSecret' => $paymentIntent->client_secret]);
    } catch (\Exception $e) {

        return response()->json(['message' => 'Stripe error', 'error' => $e->getMessage()], 500);
    }
}


}
