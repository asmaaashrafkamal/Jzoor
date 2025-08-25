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
    public function Cindex(Request $request)
{
    $userId = session('customer_id');

    $orders = Order::with([
        'user',
        'items.product.creator',
        'payment',
        'deliveryPerson'
    ])
    ->where('user_id', $userId) // filter orders for the logged-in customer
    ->latest()
    ->get();
    
    return response()->json($orders);
    
}
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
public function getOrderStats()
{
    // Current period (e.g., this month)
    $totalOrders = Order::count();
    $newOrders = Order::whereIn('status', ['Preparing', 'Pending', 'Shipped', 'Waiting Picked Up'])->count();
    $completedOrders = Order::where('status', 'Delivered')->count();
    $canceledOrders = Order::where('status', 'Canceled')->count();

    // Previous period (for percentage comparison) 
    // Example: last month
    $prevTotal = Order::whereMonth('created_at', now()->subMonth()->month)->count();
    $prevNew = Order::whereIn('status', ['Preparing', 'Pending', 'Shipped', 'Waiting Picked Up'])
        ->whereMonth('created_at', now()->subMonth()->month)
        ->count();
    $prevCompleted = Order::where('status', 'Delivered')
        ->whereMonth('created_at', now()->subMonth()->month)
        ->count();
    $prevCanceled = Order::where('status', 'Canceled')
        ->whereMonth('created_at', now()->subMonth()->month)
        ->count();

    // Helper function to calculate change %
    $calcChange = function ($current, $previous) {
        if ($previous == 0) {
            return ['change' => '100%', 'isPositive' => true];
        }
        $diff = $current - $previous;
        $percent = round(($diff / $previous) * 100, 1);
        return [
            'change' => $percent . '%',
            'isPositive' => $diff >= 0
        ];
    };

    return response()->json([
        'totalOrders' => array_merge(
            ['value' => number_format($totalOrders)],
            $calcChange($totalOrders, $prevTotal)
        ),
        'newOrders' => array_merge(
            ['value' => number_format($newOrders)],
            $calcChange($newOrders, $prevNew)
        ),
        'completedOrders' => array_merge(
            ['value' => number_format($completedOrders)],
            $calcChange($completedOrders, $prevCompleted)
        ),
        'canceledOrders' => array_merge(
            ['value' => number_format($canceledOrders)],
            $calcChange($canceledOrders, $prevCanceled)
        ),
    ]);
}
public function SgetOrderStats()
{
    $userId = session('admin_id'); // Or auth()->id()
// dd( $userId);
    // Build base query: orders that have items with products created by this user
    $baseQuery = Order::whereHas('items.product', function ($q) use ($userId) {
        $q->where('created_by', $userId); // adjust column name if it's user_id
    });

    // Current period
    $totalOrders = (clone $baseQuery)->count();
    $newOrders = (clone $baseQuery)->whereIn('status', ['Preparing', 'Pending', 'Shipped', 'Waiting Picked Up'])->count();
    $completedOrders = (clone $baseQuery)->where('status', 'Delivered')->count();
    $canceledOrders = (clone $baseQuery)->where('status', 'Canceled')->count();

    // Previous period (last month)
    $prevTotal = (clone $baseQuery)->whereMonth('created_at', now()->subMonth()->month)->count();
    $prevNew = (clone $baseQuery)->whereIn('status', ['Preparing', 'Pending', 'Shipped', 'Waiting Picked Up'])
        ->whereMonth('created_at', now()->subMonth()->month)->count();
    $prevCompleted = (clone $baseQuery)->where('status', 'Delivered')
        ->whereMonth('created_at', now()->subMonth()->month)->count();
    $prevCanceled = (clone $baseQuery)->where('status', 'Canceled')
        ->whereMonth('created_at', now()->subMonth()->month)->count();

    // Helper function to calculate change %
    $calcChange = function ($current, $previous) {
        if ($previous == 0) {
            return ['change' => '100%', 'isPositive' => true];
        }
        $diff = $current - $previous;
        $percent = round(($diff / $previous) * 100, 1);
        return [
            'change' => $percent . '%',
            'isPositive' => $diff >= 0
        ];
    };

    return response()->json([
        'totalOrders' => array_merge(
            ['value' => number_format($totalOrders)],
            $calcChange($totalOrders, $prevTotal)
        ),
        'newOrders' => array_merge(
            ['value' => number_format($newOrders)],
            $calcChange($newOrders, $prevNew)
        ),
        'completedOrders' => array_merge(
            ['value' => number_format($completedOrders)],
            $calcChange($completedOrders, $prevCompleted)
        ),
        'canceledOrders' => array_merge(
            ['value' => number_format($canceledOrders)],
            $calcChange($canceledOrders, $prevCanceled)
        ),
    ]);
}

public function getOverviewStats()
{
    // Current period (this month as example)
    $currentSales  = Order::whereMonth('created_at', now()->month)->sum('total_price');
    $currentOrders = Order::whereMonth('created_at', now()->month)->count();

    // Previous period (last month)
    $prevSales  = Order::whereMonth('created_at', now()->subMonth()->month)->sum('total_price');
    $prevOrders = Order::whereMonth('created_at', now()->subMonth()->month)->count();

    return response()->json([
        'total_sales' => [
            'current' => $currentSales,
            'prev'    => $prevSales,
        ],
        'total_orders' => [
            'current' => $currentOrders,
            'prev'    => $prevOrders,
        ],
        'pending'  => Order::where('status', 'Pending')->count(),
        'canceled' => Order::where('status', 'Canceled')->count(),
    ]);
}

public function SgetOverviewStats()
{
    $sellerId = session('admin_id'); // Or auth()->id()

    // Total sales for this seller's products
    $totalSales = Order::whereHas('items.product', function ($q) use ($sellerId) {
            $q->where('created_by', $sellerId);
        })
        ->sum('total_price');

    // Total orders for this seller's products
    $totalOrders = Order::whereHas('items.product', function ($q) use ($sellerId) {
            $q->where('created_by', $sellerId);
        })
        ->count();

    // Pending orders for this seller's products
    $pending = Order::where('status', 'Pending')
        ->whereHas('items.product', function ($q) use ($sellerId) {
            $q->where('created_by', $sellerId);
        })
        ->count();

    // Canceled orders for this seller's products
    $canceled = Order::where('status', 'Canceled')
        ->whereHas('items.product', function ($q) use ($sellerId) {
            $q->where('created_by', $sellerId);
        })
        ->count();

    return response()->json([
        'total_sales'  => $totalSales,
        'total_orders' => $totalOrders,
        'pending'      => $pending,
        'canceled'     => $canceled,
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
