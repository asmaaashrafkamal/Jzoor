<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\site\CategoryController;
use App\Http\Controllers\site\CustomerController;
use App\Http\Controllers\site\ProductController;
use App\Http\Controllers\site\ArticleController;
use App\Http\Controllers\site\OrderController;
use App\Http\Controllers\Home\LandingPageController;
use App\Http\Controllers\Home\StripeController;
use App\Http\Controllers\site\DeliveryController;
use App\Http\Controllers\site\SellerController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [CustomerController::class, 'login']);
Route::post('/register', [CustomerController::class, 'register']);

// Protected routes: only accessible if logged in
Route::middleware(['auth.session'])->group(function () {
    Route::post('/logout', [CustomerController::class, 'logout']);
//----------------------------------start products---------------------------------------------
    Route::get('/sellerProducts', [ProductController::class, 'getAllSellerProducts']);//in landing page
    Route::post('/products', [ProductController::class, 'store']);
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
Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
Route::get('/delivery-people', [OrderController::class, 'getDelivery']);
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
//---------------------------------------end orders admin dashboard--------------------------------
//--------------------------------------delivery dashboard orders----------------------------------
Route::get('/active-orders', [OrderController::class, 'getActiveOrders']);
Route::get('/get_delivered_orders', [OrderController::class, 'getDeliveredOrders']);
//---------------------------------------end orders delivery dashboard--------------------------------

});
