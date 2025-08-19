<?php

namespace App\Http\Controllers\site;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;
use App\Models\Payment;
use Carbon\Carbon;

class TransactionController extends Controller
{
public function get_customer()
{
    return User::with('orders.payment')->get();
}
public function Sget_customer($id)
{
    return User::whereHas('orders.items.product', function ($q) use ($id) {
        $q->where('created_by', $id);
    })
    ->with(['orders' => function ($orderQuery) use ($id) {
        $orderQuery->whereHas('items.product', function ($productQuery) use ($id) {
            $productQuery->where('created_by', $id);
        })->with(['payment', 'items.product']);
    }])
    ->get();
}
public function getAllTransactionsStats()
{
    $sellerId = session('admin_id'); // Or auth()->id()

    // ✅ All seller's orders
    $orders = Order::whereHas('items.product', function ($q) use ($sellerId) {
        $q->where('created_by', $sellerId);
    })->with('payment')->get();

    // ✅ Card Orders
    $cardOrders = $orders->filter(function ($order) {
        return $order->payment && $order->payment->payment_method === 'card';
    });

    // ✅ Cash Orders (Delivered only)
    $cashOrders = $orders->filter(function ($order) {
        return $order->payment 
            && $order->payment->payment_method === 'cash'
            && $order->status === 'Delivered';
    });

    // ✅ Stats
    $totalTransactions = $orders->count();
    $totalRevenue      = $orders->sum('total_price');
    $deliveredCashTransactions = $cashOrders->count();

    return response()->json([
        'transactions'              => $totalTransactions,
        'revenue'                   => $totalRevenue,
        'deliveredCashTransactions' => $deliveredCashTransactions,
        'cardTransactions'          => $cardOrders->count(),
        'cashTransactions'          => $cashOrders->count(),
    ]);
}

public function getAllTransactions()
{
    $payments = Payment::with('order.user') // make sure Order has user() relationship
        ->latest()
        ->get();

    return response()->json([
        'status' => true,
        'data' => $payments->map(function ($payment, $index) {
            return [
                'no'         => $index + 1,
                'idCustomer' => '#'.($payment->order->user->id ?? '----'),
                'orderDate'  => Carbon::parse($payment->created_at)->format('d M | h:i a'),
                'status'     => $payment->payment_status ?? 'Unknown',
                'amount'     => '$' . number_format($payment->order->total_price ?? 0, 2),
            ];
        }),
    ]);
}
}
