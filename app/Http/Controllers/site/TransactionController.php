<?php

namespace App\Http\Controllers\site;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;
class TransactionController extends Controller
{
public function get_customer()
{
    return User::with('orders.payment')->get();
}

public function getAllTransactionsStats()
{
 $cardOrders = Order::whereHas('payment', function ($q) {
    $q->where('payment_method', 'card');
});

$cashOrders = Order::whereHas('payment', function ($q) {
    $q->where('payment_method', 'cash');
})->where('status', 'Delivered');

$orders = $cardOrders->union($cashOrders)->get();

$totalTransactions = $orders->count();
$totalRevenue = $orders->sum('total_price');
  $deliveredCashTransactions = Order::where('status', 'Delivered')
        ->whereHas('payment', function ($q) {
            $q->where('payment_method', 'cash');
        })->count();

    return response()->json([
        'transactions' => $totalTransactions,
        'revenue' => $totalRevenue,
        'deliveredCashTransactions'=>$deliveredCashTransactions,
    ]);
}
}
