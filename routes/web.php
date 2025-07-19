<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\site\CategoryController;
use App\Http\Controllers\site\ArticleController;
use App\Http\Controllers\site\ProductController;
use App\Http\Controllers\site\OrderController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Home\LandingPageController;
use App\Http\Controllers\Home\StripeController;
use App\Http\Controllers\Home\ProfileController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
//check if still login
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/check-login', function () {
    if (session('admin_logged_in')) {
        return response()->json([
            'logged_in' => true,
            'role' => session('admin_type'),
            'user' => session()->only(['admin_id', 'admin_name', 'admin_email', 'admin_type', 'admin_image','admin_gender','admin_state','admin_address','admin_date','admin_phone']),
        ]);
    } elseif (session('customer_logged_in')) {
        return response()->json([
            'logged_in' => true,
            'role' => session('customer_type'),
            'user' => session()->only(['customer_id', 'customer_name', 'customer_email', 'customer_type', 'customer_image','customer_gender','customer_state','customer_address','customer_date','customer_phone']),
        ]);
    }

    return response()->json(['logged_in' => false]);

});
//endregisterand
//route category of landing page
    Route::get('/getAllCategory', [LandingPageController::class, 'getCat']);
    Route::get('/getAllCategoryProduct', [LandingPageController::class, 'getAllCategoriesWithProducts']);
    Route::get('/category/{id}/products', [LandingPageController::class, 'getSpecificCategory']);
    Route::get('/products/{id}', [LandingPageController::class, 'getSpecificProduct']);
    Route::get('/products_sizes/{id}', [LandingPageController::class, 'getSpecificProductSizes']);
    Route::get('/products_colors/{id}', [LandingPageController::class, 'getSpecificProductColors']);
    // Route::post('/articles', [ArticleController::class, 'store']);//
    Route::get('/JournalsDetails/{id}', [LandingPageController::class, 'getJornalsList']);
    Route::get('/getCat', [CategoryController::class, 'getCat']);
    Route::post( '/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    Route::prefix('articles')->group(function () {
    Route::get('/', [ArticleController::class, 'index']);
    Route::get('/{id}', [ArticleController::class, 'show']);
    Route::post('/', [ArticleController::class, 'store']);
    Route::put('/{id}', [ArticleController::class, 'update']);
    Route::delete('/{id}', [ArticleController::class, 'destroy']);
});

    //end

Route::get('/{any}', action: function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '.*');

Route::middleware(['auth.session'])->group(function () {
Route::post('/StoreProfile', [ProfileController::class, 'store']);
Route::post( '/place-order', [StripeController::class, 'checkout']);
Route::post( '/create-payment-intent', [StripeController::class, 'createPaymentIntent']);

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/AdminStoreproducts', [ProductController::class, 'store']);
    // Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/getCat', [CategoryController::class, 'getCat']);
    // Route::put('/categories/{id}', [CategoryController::class, 'update']);
    // Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    Route::get('/seller/products', [ProductController::class, 'getProductsBySeller']);//in seller dashboard

});
