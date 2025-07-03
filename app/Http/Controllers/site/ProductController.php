<?php

namespace App\Http\Controllers\site;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string',
        'description' => 'nullable|string',
        'price' => 'required|numeric',
        'discount' => 'nullable|numeric',
        'stock' => 'nullable|integer',
        'stock_status' => 'required|in:In Stock,Out of Stock',
        'tax_included' => 'required|boolean',
        'highlight' => 'required|boolean',
        'category_id' => 'required|exists:categories,id',
        'tags' => 'nullable|string',
        'image' => 'nullable|image|max:2048',
    ]);
$adminId = Auth::guard('admin')->id();

    $product = new Product();
    $product->name = $request->name;
    $product->description = $request->description;
    $product->price = $request->price;
    $product->discounted_price = $request->discount;
    $product->stock_quantity = $request->stock;
    $product->stock_status = $request->stock_status;
    $product->tax_included = $request->tax_included;
    $product->highlight = $request->highlight;
    $product->category_id = $request->category_id;
    $product->tags = $request->tags;
    $product->created_by = $adminId; // ✅ Set created_by

    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('products', 'public');
        $product->image = $imagePath;
    }

    // ❗ Save product first to get its ID
    $product->save();

    // ✅ Decode pot_colors and pot_sizes from JSON
    $colors = json_decode($request->input('pot_colors'), true);
    $sizes = json_decode($request->input('pot_sizes'), true);

    // ✅ Save pot colors
    if (is_array($colors)) {
        foreach ($colors as $color) {
            $product->colors()->create(['color_code' => $color]);
        }
    }

    // ✅ Save pot sizes
    if (is_array($sizes)) {
        foreach ($sizes as $size) {
            $product->sizes()->create(['size' => $size]);
        }
    }

    return response()->json([
        'message' => 'Product added successfully',
        'product' => $product
    ], 201);
}


}