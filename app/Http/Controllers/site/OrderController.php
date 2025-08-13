<?php

namespace App\Http\Controllers\site;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Order_Item;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class OrderController extends Controller
{
//-------------------------------------------start orders admin dashboard order page--------------------------------------
public function index(Request $request)
{
    $orders = Order::with([
        'user',
        'items.product.creator', // eager load nested relationships
        'payment','deliveryPerson'
    ])->latest()->get();

    return response()->json($orders);
}
public function SellerOrders(Request $request, $id)
{
    $orders = Order::with([
        'user',
        'items.product.creator',
        'payment',
        'deliveryPerson'
    ])
    ->whereHas('items.product.creator', function ($query) use ($id) {
        $query->where('id', $id);
    })
    ->latest()
    ->get();

    return response()->json($orders);
}

// In your OrderController.php

public function show($orderId)
{
    $order = Order::with(['user', 'items.product.creator', 'payment', 'deliveryPerson'])->find($orderId);
    if (!$order) {
        return response()->json([], 404);
    }

    // Normalize status (e.g. "picked up" → "picked_up")
    $status = strtolower(str_replace(' ', '_', $order->status));
    $order->status_text = $this->getStatusText($status);
    $order->estimated_delivery_date = $this->getEstimatedDate($order->updated_at);

    $created = Carbon::parse($order->created_at);
    $pickupDate = $created->copy()->addDay();
    $deliveredDate = $created->copy()->addDays(2);
    $canceledDate = $created->copy()->addMinutes(10);

    $order->waiting_pickup_at = $created;
    $order->picked_up_at = in_array($status, ['picked_up', 'in_transit', 'out_for_delivery', 'delivered']) ? $pickupDate : null;
    $order->in_transit_at = in_array($status, ['in_transit', 'out_for_delivery', 'delivered']) ? $pickupDate : null;
    $order->out_for_delivery_at = in_array($status, ['out_for_delivery', 'delivered']) ? $pickupDate : null;
    $order->delivered_at = $status === 'delivered' ? $deliveredDate : null;
    $order->canceled_at = $status === 'canceled' ? $canceledDate : null;

    return response()->json($order);
}


private function getStatusText($status)
{
    return match ($status) {
        'waiting_pickup' => 'On Time',
        'picked_up' => 'Picked Up',
        'in_transit' => 'In Transit',
        'out_for_delivery' => 'Out For Delivery',
        'delivered' => 'Delivered',
        'canceled' => 'Canceled',
        default => 'Pending',
    };
}



public function getEstimatedDate($updatedAt)
{
    return Carbon::parse($updatedAt)->addWeeks(2);
}


public function getOrdersForDelivery()
{
    $deliveryId = Auth::guard('admin')->id();

    // Optional: check if admin is type D
    $admin = Auth::guard('admin')->user();
    if (!$admin || $admin->type !== 'D') {
        return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
    }

    $orders = Order::with(['user', 'items', 'payment']) // eager load related data
        ->where('delivery_person_id', $deliveryId)
        ->latest()
        ->get();

    return response()->json([
        'status' => true,
        'data' => $orders
    ]);
}




public function updateStatus(Request $request, $id)
{
    $order = Order::findOrFail($id);
    $request->validate([
        'status' => 'required|string|in:Pending,Preparing,Shipped,Picked Up,In Transit,Delivered,Canceled',
    ]);

    $order->status = $request->status;
    $order->updated_at = now();
    $order->save();

    return response()->json(['message' => 'Order updated successfully']);
}
public function destroy($id)
{
    $order = Order::findOrFail($id);
    $order->delete();

    return response()->json(['message' => 'Order deleted']);
}
public function getDelivery()
{
    $delivery = Admin::where('type', 'D')->get(['id', 'full_name as name', 'phone']);

    return response()->json($delivery);
}
public function assignDeliveryPerson(Request $request, $orderId)
{

    $request->validate([
        'delivery_person_id' => 'required|exists:admins,id'
    ]);

    $order = Order::findOrFail($orderId);
    $order->delivery_person_id = $request->delivery_person_id;

    // ✅ Automatically update status
    if ($order->status === 'Shipped') {
        $order->status = 'Waiting Picked Up';
    }
    $order->save();

    $order->load('deliveryPerson');

    return response()->json([
        'message' => 'Delivery person assigned',
        'deliveryPerson' => $order->deliveryPerson,
        'status' => $order->status
    ]);

}


//-------------------------------------------end orders admin dashboard------------------------------------------------
//--------------------------------------------start orders delivery dashboard------------------------------------------
public function getActiveOrders(Request $request)
{

    // $deliveryPersonId = Auth::guard('admin')->id(); // default to 5 if not provided
    // dd(session()->all()); // Dumps all session data
    // dd($request->delivery_person_id);
    $orders = Order::with(['user', 'items.product', 'payment', 'deliveryPerson'])
        ->where('delivery_person_id',session('admin_id'))
        ->whereIn('status', ['Waiting Picked Up', 'Picked Up', 'In Transit'])
        ->get();

    return response()->json($orders);
}
public function getDeliveredOrders(Request $request)
{
    return Order::with(['user', 'items.product', 'payment'])
        ->where('delivery_person_id', session('admin_id'))
        ->where('status', 'Delivered') // <-- filter here
        ->get();
}
//--------------------------------------------end orders delivery dashboard----------------------------------------
}
