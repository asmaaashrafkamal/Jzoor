<?php

namespace App\Http\Controllers\site;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Order_Item;
use App\Models\User;
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
    $deliveryPersonId = $request->input('delivery_person_id', 5); // default to 5 if not provided

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
