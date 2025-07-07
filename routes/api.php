<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\site\CategoryController;
use App\Http\Controllers\site\CustomerController;
use App\Http\Controllers\site\ProductController;
use App\Http\Controllers\site\ArticleController;
use App\Http\Controllers\Home\LandingPageController;
use App\Http\Controllers\Home\StripeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [CustomerController::class, 'login']);
Route::post('/register', [CustomerController::class, 'register']);
// Route::post( '/place-order', [StripeController::class, 'checkout']);
// Route::post( '/create-payment-intent', [StripeController::class, 'createPaymentIntent']);
//

// Protected routes: only accessible if logged in
Route::middleware(['auth.session'])->group(function () {
    Route::post('/logout', [CustomerController::class, 'logout']);
    Route::get('/sellerProducts', [ProductController::class, 'getAllSellerProducts']);//in landing page


    Route::post('/products', [ProductController::class, 'store']);
Route::get('/category/name1', [LandingPageController::class, 'getCategoryByName1']);
Route::get('/category/name2', [LandingPageController::class, 'getCategoryByName2']);
Route::get('/category/name3', [LandingPageController::class, 'getCategoryByName3']);

    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/getCat', [CategoryController::class, 'getCat']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
});
