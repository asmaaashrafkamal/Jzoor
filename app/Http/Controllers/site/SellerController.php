<?php

namespace App\Http\Controllers\site;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Order_Item;
use App\Models\Order;
use App\Models\Product;

class SellerController extends Controller
{
    public function stats()
    {
        $totalSellers = Admin::where('type', 'S')->count();
    
        $newSellersLast7Days = Admin::where('type', 'S')
            ->where('created_at', '>=', now()->subDays(7))
            ->count();
    
        $visitors = 250000; // TODO: Replace with real visitor count if available
    
        $totalSalesValue = Order::whereIn('status', [
            'Shipped',
            'Delivered',
            'Waiting Picked Up',
            'Picked Up',
            'In Transit'
        ])
        ->sum('total_price');
    
    
        return response()->json([
            'totalSellers' => [
                'raw' => $totalSellers,
                'value' => number_format($totalSellers),
                'change' => '14.4%', 
                'isPositive' => true
            ],
            'newSellers' => [
                'raw' => $newSellersLast7Days,
                'value' => number_format($newSellersLast7Days),
                'change' => '20%',
                'isPositive' => true
            ],
            'totalSalesValue' => [
                'raw' => $totalSalesValue,
                'value' => number_format($totalSalesValue, 2),
                'change' => '20%',
                'isPositive' => true
            ],
            'visitors' => [
                'raw' => $visitors,
                'value' => number_format($visitors),
                'change' => '5%',
                'isPositive' => true
            ],
        ]);
    }
    public function sellersOverview()
{
    // ✅ Products statuses
    $approvedProducts = Product::where('status', 'accepted')->count();
    $pendingProducts = Product::where('status', 'pending')->count();
    $rejectedProducts = Product::where('status', 'rejected')->count();

    $totalProducts = $approvedProducts + $pendingProducts + $rejectedProducts;

    // ✅ Sellers statuses
    $activeSellers = Admin::where('type', 'S')->where('status', 'active')->count();
    $inactiveSellers = Admin::where('type', 'S')->where('status', 'inactive')->count();
    $suspendedSellers = Admin::where('type', 'S')->where('status', 'Suspended')->count();

    return response()->json([
        'products' => [
            'approved' => $approvedProducts,
            'pending' => $pendingProducts,
            'rejected' => $rejectedProducts,
            'total' => $totalProducts,
        ],
        'sellers' => [
            'active' => $activeSellers,
            'inactive' => $inactiveSellers,
            'suspended' => $suspendedSellers,
        ]
    ]);
}

public function get_seller()
{
    return Admin::with('products')
        ->where('type', 'S')
        ->get();
}
public function seller_update(Request $request, $id)
{
    $request->validate([
        'full_name' => 'required|string|max:255',
        'phone'     => 'required|string',
        'status'    => 'nullable|string',
    ]);

    $user = Admin::findOrFail($id);
    $user->full_name = $request->full_name;
    $user->phone = $request->phone;
    $user->status = $request->status;
    $user->save();

    return response()->json(['message' => 'Seller updated successfully']);
}

public function Seller_destroy($id)
{
    // Fetch seller (Admin model)
    $seller = Admin::find($id);

    // Check if seller exists
    if (!$seller) {
        return response()->json(['message' => 'Seller not found'], 404);
    }

    // Check if seller has products with order items
    $hasSellerProduct = Order_Item::whereHas('product', function ($query) use ($id) {
        $query->where('created_by', $id);
    })->exists();

    if ($hasSellerProduct) {
        return response()->json(['message' => 'Seller cannot be deleted because their products have orders'], 400);
    }

    // Safe to delete
    $seller->delete();

    return response()->json(['message' => 'Seller deleted successfully']);
}

public function monthlySellers()
{
    $months = collect(range(1, 12))->mapWithKeys(fn($m) => [$m => 0]);

    $users = Admin::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
    ->whereYear('created_at', now()->year)
    ->where('type', 'S') // ✅ Filter only type == 'S'
    ->groupBy('month')
    ->pluck('count', 'month');


    // Merge actual counts into zero-filled months
    $monthlyCounts = $months->merge($users)->values();

    return response()->json($monthlyCounts);
}
public function get_customer($sellerId)
{
// $users = User::whereHas('orders.items.product', function ($query) use ($sellerId) {
//     $query->where('created_by', $sellerId);
// })
// // ->with([
// //   'orders' => function ($query) use ($sellerId) {
// //       $query->whereHas('items.product', function ($q) use ($sellerId) {
// //           $q->where('created_by', $sellerId);
// //       });
// //   },
// //   'orders.items.product'
// // ])
// ->get();
    $users= User::whereHas('orders')->with('orders')->get();


    return response()->json($users);
}


public function customer_update(Request $request, $id)
{
    $request->validate([
        'full_name' => 'required|string|max:255',
        'phone'     => 'required|string',
        'status'    => 'nullable|string',
    ]);

    $user = User::findOrFail($id);
    $user->full_name = $request->full_name;
    $user->phone = $request->phone;
  if (!is_null($request->status)) {
        $user->status = $request->status;
    }
        $user->save();

    return response()->json(['message' => 'Customer updated successfully']);
}

public function customer_destroy($id)
{
    $user = User::with('orders')->findOrFail($id);

    // Check if any order has status 'Pick Up' or 'In Transit'
    $hasRestrictedStatus = $user->orders->contains(function ($order) {
        $status = strtolower($order->status);
        return $status === 'picked up' || $status === 'in transit';
    });

    if ($hasRestrictedStatus) {
        return response()->json([
            'error' => 'Cannot delete user with orders in "Pick Up" or "In Transit" status'
        ], 403);
    }

    // Optional: delete user's non-restricted orders too
    // $user->orders()->delete();

    $user->delete();

    return response()->json(['message' => 'User deleted successfully']);
}
// public function monthlyCustomers()
// {
//     $sellerId = session('admin_id'); // Or auth()->id()
//     // Start with 12 months initialized to 0
//      // Get all users who ordered products created by this seller
//      $customers = User::whereHas('orders.items.product', function ($query) use ($sellerId) {
//         $query->where('created_by', $sellerId); // or 'admin_id' if you store creator like that
//     })
//     ->distinct()
//     ->get();

//     return response()->json($customers);
// }
public function monthlyCustomers()
{
    $sellerId = session('admin_id'); // Or auth()->id()

    // Start with 12 months initialized to 0
    $months = collect(range(1, 12))->mapWithKeys(fn($m) => [$m => 0]);

    // Query distinct users who bought seller's products
    $users = \App\Models\User::selectRaw('MONTH(orders.created_at) as month, COUNT(DISTINCT users.id) as count')
        ->join('orders', 'users.id', '=', 'orders.user_id')
        ->join('order_items', 'orders.id', '=', 'order_items.order_id')
        ->join('products', 'order_items.product_id', '=', 'products.id')
        ->whereYear('orders.created_at', now()->year)
        ->where('products.created_by', $sellerId) // 👈 your products only
        ->groupBy('month')
        ->pluck('count', 'month');

    // Merge with months (fill missing months with 0)
    $monthlyCounts = $months->map(function ($value, $month) use ($users) {
        return $users[$month] ?? 0;
    });

    return response()->json($monthlyCounts->values());
}

public function Cstats()
{
    $sellerId = session('admin_id'); // Or auth()->id()

    $customerIds = User::whereHas('orders.items.product', function ($q) use ($sellerId) {
        $q->where('created_by', $sellerId);
    })->pluck('id');

    // Total unique customers for this seller
    $totalCustomers = $customerIds->count();

    // New customers in last 7 days
    $newCustomersLast7Days = User::whereIn('id', $customerIds)
        ->where('created_at', '>=', now()->subDays(7))
        ->count();

    // Example visitors metric (static or custom logic)
    $visitors = 250000; // Replace with real tracking if available

    return response()->json([
        'totalCustomers' => [
            'value' => number_format($totalCustomers),
            'change' => '14.4%', // Optional: compute vs previous period
            'isPositive' => true
        ],
        'newCustomers' => [
            'value' => number_format($newCustomersLast7Days),
            'change' => '20%',
            'isPositive' => true
        ],
        'visitors' => [
            'value' => '250k', // Hardcoded or from analytics
            'change' => '20%',
            'isPositive' => true
        ],
    ]);
}
}
