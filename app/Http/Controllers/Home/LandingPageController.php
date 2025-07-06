<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use App\Models\Product_Color;
use App\Models\Product_Size;

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
public function getSpecificProduct($id)
{
    $product = Product::where('id', $id)->first();

    if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
    }

    return response()->json($product);
}
public function getSpecificProductColors($id)
{
    $colors = Product_Color::where('product_id', $id)->get();

    if ($colors->isEmpty()) {
        return response()->json(['message' => 'Colors not found'], 404);
    }

    return response()->json($colors);
}

public function getSpecificProductSizes($id)
{
    $sizes = Product_Size::where('product_id', $id)->get();

    if ($sizes->isEmpty()) {
        return response()->json(['message' => 'Sizes not found'], 404);
    }

    return response()->json($sizes);
}
public function getCategoryByName1()
{
    $category = Category::where('cat_name', 'Trees')->with('products')->first();

    if (!$category) {
        return response()->json(['message' => 'Category not found'], 404);
    }

    return response()->json($category);
}
public function getCategoryByName2()
{
    $category = Category::where('cat_name', 'Gifts')->with('products')->first();

    if (!$category) {
        return response()->json(['message' => 'Category not found'], 404);
    }

    return response()->json($category);
}
public function getCategoryByName3()
{
    $category = Category::where('cat_name', 'Tools&Care')->with('products')->first();

    if (!$category) {
        return response()->json(['message' => 'Category not found'], 404);
    }

    return response()->json($category);
}
}
