<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\site\CategoryController;
use App\Http\Controllers\site\CustomerController;
use App\Http\Controllers\site\ProductController;

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

    Route::post('/products', [ProductController::class, 'store']);

    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/getCat', [CategoryController::class, 'getCat']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
});
