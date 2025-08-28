<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\site\CategoryController;
use App\Http\Controllers\site\CustomerController;
use App\Http\Controllers\site\ProductController;
use App\Http\Controllers\site\ArticleController;
use App\Http\Controllers\site\OrderController;
use App\Http\Controllers\Home\LandingPageController;
use App\Http\Controllers\Home\ProfileController;
use App\Http\Controllers\site\DeliveryController;
use App\Http\Controllers\site\SellerController;
use App\Http\Controllers\site\NotificationController;
use App\Http\Controllers\site\TransactionController;
use App\Http\Controllers\Home\ChatController;
use App\Http\Controllers\ReviewController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [CustomerController::class, 'login']);
Route::post('/register', [CustomerController::class, 'register']);

// Protected routes: only accessible if logged in
Route::middleware(['auth.session'])->group(function () {
//----------------------------------start products---------------------------------------------
    Route::get('/sellerProducts', [ProductController::class, 'getAllSellerProducts']);//in landing page
    Route::get('/AdminsellerProducts', [ProductController::class, 'getAllAdminSellerProducts']);//in admin product list
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/top-products', [ProductController::class, 'getTopProducts']);
    Route::get('/best-sellers', [ProductController::class, 'getBestSellers']);
    Route::get('/catalog', [ProductController::class, 'getAllCatalog']);
    Route::get('/report', [ProductController::class, 'weeklyReport']);
    Route::get('/review-stats', [ProductController::class, 'getReviewStats']);

    //-----------------------------------end products------------------------------------------------
//------------------------------------start landingPage-------------------------------------------
    Route::get('/category/name1', [LandingPageController::class, 'getCategoryByName1']);
    Route::get('/category/name2', [LandingPageController::class, 'getCategoryByName2']);
    Route::get('/category/name3', [LandingPageController::class, 'getCategoryByName3']);
    Route::get('/homeJournals', [LandingPageController::class, 'getJornalsHome']);

//--------------------------------------end landingPage----------------------------------------------------------
    Route::post( '/categories', [CategoryController::class, 'store']);
    Route::get('/getCat', [CategoryController::class, 'getCat']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
//-------------------------------------------------------------------------------------------
//--------------------------------------admin dashboard orders----------------------------------
Route::get('/orders', [OrderController::class, 'index']);
Route::get('/categories-with-products', [CategoryController::class, 'allWithProducts']);
Route::get('/SellerOrders/{id}', [OrderController::class, 'SellerOrders']);
Route::get('/order/{orderId}', [OrderController::class, 'show']);
Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
Route::get('/delivery-people', [OrderController::class, 'getDelivery']);
Route::get('/dashboard-stats', [OrderController::class, 'getOverviewStats']);
Route::get('/order-stats', [OrderController::class, 'getOrderStats']);
Route::post('/orders/{orderId}/assign-delivery', [OrderController::class, 'assignDeliveryPerson']);
Route::get('/get_customer', [CustomerController::class, 'get_customer']);
Route::put('/customers/{id}', [CustomerController::class, 'customer_update']);
Route::delete('/customers/{id}', [CustomerController::class, 'customer_destroy']);
Route::get('/monthly-customers', [CustomerController::class, 'monthlyCustomers']);
Route::get('/customer-stats', [CustomerController::class, 'stats']);
Route::get('/get_seller', [SellerController::class, 'get_seller']);
Route::put('/sellers/{id}', [SellerController::class, 'seller_update']);
Route::delete('/seller/{id}', [SellerController::class, 'Seller_destroy']);
Route::get('/monthly-sellers', [SellerController::class, 'monthlySellers']);
Route::get('/seller-stats', [SellerController::class, 'stats']);
Route::get('/get_delivery', [DeliveryController::class, 'get_delivery']);
Route::get('/monthly-delivery', [DeliveryController::class, 'monthlyDelivery']);
Route::get('/delivery-stats', [DeliveryController::class, 'stats']);
Route::put('/delivery/{id}', [DeliveryController::class, 'delivery_update']);
Route::delete('/delivery/{id}', [DeliveryController::class, 'delivery_destroy']);
Route::get('/overview', [DeliveryController::class, 'overview']);
Route::get('/monthly-deliveries', [DeliveryController::class, 'getMonthlyDeliveries']);

Route::get('/payment-summary', [TransactionController::class, 'getAllTransactionsStats']);

//---------------------------------------end orders admin dashboard--------------------------------

//----------------------------------------start seller dashboard-----------------------------------------
Route::get('/Sget_customer/{sellerId}', [SellerController::class, 'get_customer']);
Route::put('/Scustomers/{id}', [SellerController::class, 'customer_update']);
Route::delete('/Scustomers/{id}', [SellerController::class, 'customer_destroy']);
Route::get('/Smonthly-customers', [SellerController::class, 'monthlyCustomers']);
Route::get('/sellers-overview', [SellerController::class, 'sellersOverview']);

//----------------------------------------end seller dashboard-----------------------------------------
Route::get('/Tget_customer', [TransactionController::class, 'get_customer']);


// Route::get('/chat/admin/{adminId}', [ChatController::class, 'getMessagesFromDriver']);
// Route::post('/chat/send', [ChatController::class, 'sendMessage']);
Route::get('/transactions', [TransactionController::class, 'getAllTransactions']);

});
// routes/api.php
Route::get('/notifications', [NotificationController::class, 'index']);
Route::post('/notifications', [NotificationController::class, 'store']);
Route::post('/notifications/read/{id}', [NotificationController::class, 'markAsRead']);
Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
Route::get('/low-stock-products', [ProductController::class, 'lowStockProducts']);
