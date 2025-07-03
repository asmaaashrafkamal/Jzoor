<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;

class LandingPageController extends Controller
{
public function getCat() {
        $category = Category::all();
        return response()->json($category);
 }
public function getAllCategoriesWithProducts()
{
    $categories = Category::with('products')->get();
    return response()->json($categories);
}

public function getSpecificCategory($id)
{
   $products = Product::where('category_id', $id)->get();

    return response()->json($products);
}
}
