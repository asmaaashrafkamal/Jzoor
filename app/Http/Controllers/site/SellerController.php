<?php

namespace App\Http\Controllers\site;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Order_Item;
class SellerController extends Controller
{
public function stats()
{
  $totalSellers = Admin::where('type', 'S')->count();

$newSellersLast7Days = Admin::where('type', 'S')
    ->where('created_at', '>=', now()->subDays(7))
    ->count();
$visitors = 250000; // Optional: Replace with real logic if needed

    return response()->json([
        'totalSellers' => [
            'value' => number_format($totalSellers),
            'change' => '14.4%', // Optional: calculate vs previous period
            'isPositive' => true
        ],
        'newSellers' => [
            'value' => number_format($newSellersLast7Days),
            'change' => '20%',
            'isPositive' => true
        ],
        'totalSalesValue' => [
            'value' => '250k', // hardcoded or calculate
            'change' => '20%',
            'isPositive' => true
        ],
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
public function monthlyCustomers()
{
    $months = collect(range(1, 12))->mapWithKeys(fn($m) => [$m => 0]);

    $users = User::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
        ->whereYear('created_at', now()->year)
        ->groupBy('month')
        ->pluck('count', 'month');

    // Merge actual counts into zero-filled months
    $monthlyCounts = $months->merge($users)->values();

    return response()->json($monthlyCounts);
}

public function Cstats()
{
    $totalCustomers = User::count();
    $newCustomersLast7Days = User::where('created_at', '>=', now()->subDays(7))->count();
    $visitors = 250000; // Optional: Replace with real logic if needed

    return response()->json([
        'totalCustomers' => [
            'value' => number_format($totalCustomers),
            'change' => '14.4%', // Optional: calculate vs previous period
            'isPositive' => true
        ],
        'newCustomers' => [
            'value' => number_format($newCustomersLast7Days),
            'change' => '20%',
            'isPositive' => true
        ],
        'visitors' => [
            'value' => '250k', // hardcoded or calculate
            'change' => '20%',
            'isPositive' => true
        ],
    ]);
}
}
