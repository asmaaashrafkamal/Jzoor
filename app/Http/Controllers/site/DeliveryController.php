<?php

namespace App\Http\Controllers\site;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
class DeliveryController extends Controller
{
    public function getMonthlyDeliveries()
    {
        // Get current year deliveries grouped by month
        $deliveries = DB::table('orders')
            ->selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->whereYear('created_at', Carbon::now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    
        // Prepare data: Ensure all months appear (even with 0 deliveries)
        $months = collect(range(1, 12))->map(function ($m) use ($deliveries) {
            $delivery = $deliveries->firstWhere('month', $m);
            return [
                'month' => Carbon::create()->month($m)->format('F'), // January, February...
                'total' => $delivery ? $delivery->total : 0,
            ];
        });
    
        return response()->json([
            'monthlyDeliveries' => $months
        ]);
    }
    public function stats()
    {
        // total delivery users
        $totalSellers = Admin::where('type', 'D')->count();
    
        // new deliveries in the last 7 days
        $newSellersLast7Days = Admin::where('type', 'D')
            ->where('created_at', '>=', now()->subDays(7))
            ->count();
    
        // total delivered orders (querying directly from orders table)
        $completedOrders = Order::where('status', 'Delivered')->count();
    
        return response()->json([
            'totalDelivery' => [
                'value' => number_format($totalSellers),
                'change' => '14.4%',
                'isPositive' => true
            ],
            'newDelivery' => [
                'value' => number_format($newSellersLast7Days),
                'change' => '20%',
                'isPositive' => true
            ],
            'deliveredToday' => [
                'value' => number_format($completedOrders),
                'change' => '20%',
                'isPositive' => true
            ],
        ]);
    }
public function get_delivery(Request $request)
{
    $query = Admin::where('type', 'D'); // D for Delivery


    $deliveryPeople = $query->get();

    // Add order counts to each delivery person
    $data = $deliveryPeople->map(function ($delivery) {
        $activeOrders = $delivery->orders()
                            ->where('status', '!=', 'Delivered')
                            ->count();

        $completedOrders = $delivery->orders()
                            ->where('status', 'Delivered')
                            ->count();

        return [
            'id'               => $delivery->id,
            'full_name'        => $delivery->full_name,
            'phone'            => $delivery->phone,
            'status'           => $delivery->status,
            'active_orders'    => $activeOrders,
            'completed_orders' => $completedOrders,
        ];
    });

    return response()->json($data);
}

public function delivery_update(Request $request, $id)
{
    $request->validate([
        'full_name' => 'required|string|max:255',
        'phone'     => 'required|string',
        'status'    => 'nullable|string',
    ]);

    $user = Admin::findOrFail($id);
    $user->full_name = $request->full_name;
    $user->phone = $request->phone;
    $user->save();

    return response()->json(['message' => 'Delivery updated successfully']);
}

public function delivery_destroy($id)
{
    // Fetch seller (Admin model)
    $seller = Admin::find($id);

    // Check if seller exists
    if (!$seller) {
        return response()->json(['message' => 'Seller not found'], 404);
    }

    // Check if seller has products with order items
    $hasSellerProduct = Order::whereHas('deliveryPerson', function ($query) use ($id) {
        $query->where('id', $id);
    })->exists();

    if ($hasSellerProduct) {
        return response()->json(['message' => 'Seller cannot be deleted because their products have orders'], 400);
    }

    // Safe to delete
    $seller->delete();

    return response()->json(['message' => 'Seller deleted successfully']);
}

public function monthlyDelivery()
{
    $months = collect(range(1, 12))->mapWithKeys(fn($m) => [$m => 0]);

   $users = Admin::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
    ->whereYear('created_at', now()->year)
    ->where('type', 'D') // ✅ Filter only type == 'D'
    ->groupBy('month')
    ->pluck('count', 'month');


    // Merge actual counts into zero-filled months
    $monthlyCounts = $months->merge($users)->values();

    return response()->json($monthlyCounts);
}

public function overview()
{
    // Example for product statuses
    $delivered = Order::where('status', 'Delivered')->count();
    $returned = Order::where('status', 'Canceled')->count();
    $onTheWay = Order::whereIn('status', ['Picked Up','In Transit'])->count();

    // Example for delivery statuses
    $activeSellers = Admin::where('type', 'D')->where('status', 'active')->count();
    $suspendedSellers = Admin::where('type', 'D')->where('status', 'inactive')->count();

    return response()->json([
        'productStatuses' => [
            'Delivered' => $delivered,
            'Returned' => $returned,
            'On The Way' => $onTheWay,
        ],
        'sellerStatuses' => [
            'Active' => $activeSellers,
            'Suspended' => $suspendedSellers,
        ]
    ]);
}

}
