<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\site\CategoryController;
use App\Http\Controllers\site\ArticleController;
use App\Http\Controllers\site\ProductController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Home\LandingPageController;

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
            'user' => session()->only(['admin_id', 'admin_name', 'admin_email', 'admin_type', 'admin_image']),
        ]);
    } elseif (session('customer_logged_in')) {
        return response()->json([
            'logged_in' => true,
            'role' => 'C',
            'user' => session()->only(['customer_id', 'customer_name', 'customer_email', 'customer_type', 'customer_image']),
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
Route::post('/articles', [ArticleController::class, 'store']);//

    //end

Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '.*');

Route::middleware(['auth.session'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/AdminStoreproducts', [ProductController::class, 'store']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/getCat', [CategoryController::class, 'getCat']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    Route::get('/seller/products', [ProductController::class, 'getProductsBySeller']);//in seller dashboard

});
