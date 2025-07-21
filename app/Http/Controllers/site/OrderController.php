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
// In your OrderController.php

public function show($orderId)
{
    $order = Order::with(['user', 'items.product.creator', 'payment', 'deliveryPerson'])->find($orderId);
    if (!$order) {
        return response()->json([], 404);
    }
    $order->status_text = $this->getStatusText($order->status);
    $order->estimated_delivery_date = $this->getEstimatedDate($order->updated_at);
    $created = Carbon::parse($order->created_at);
    $order->waiting_pickup_at = $created;
    $order->picked_up_at = ($order->status !== 'Waiting Picked Up'||$order->status === 'Picked Up') ? $created->copy()->addDays(1) : null;
    $order->out_for_delivery_at = ($order->status === 'out_for_delivery' || $order->status === 'Delivered') ? $created->copy()->addDays(1) : null;
    $order->delivered_at = ($order->status === 'Delivered') ? $created->copy()->addDays(2) : null;
    $order->canceled_at = ($order->status === 'Canceled') ? $created->copy()->addMinutes(10) : null;

    return response()->json($order);
}
private function getStatusText($status)
{
    return match ($status) {
        'waiting_pickup', 'Waiting Picked Up' => 'On Time',
        'picked_up', 'Picked Up' => 'Out For Delivery',
        'out_for_delivery', 'Out For Delivery' => 'Out For Delivery',
        'delivered', 'Delivered' => 'Delivered',
        'canceled', 'Canceled' => 'Canceled',
        default => 'Pending',
    };
}


public function getEstimatedDate($updatedAt)
{
    return Carbon::parse($updatedAt)->addWeeks(2);
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

    $deliveryPersonId = Auth::guard('admin')->id(); // default to 5 if not provided

    $orders = Order::with(['user', 'items.product.creator', 'payment', 'deliveryPerson'])
        ->where('delivery_person_id', $deliveryPersonId)
        ->whereIn('status', ['Waiting Picked Up', 'Picked Up', 'In Transit'])
        ->get();

    return response()->json($orders);
}
public function getDeliveredOrders(Request $request)
{
    return Order::with(['user', 'items.product', 'payment'])
        ->where('delivery_person_id', $request->delivery_person_id)
        ->where('status', 'Delivered') // <-- filter here
        ->get();
}
//--------------------------------------------end orders delivery dashboard----------------------------------------
}
