<?php

namespace App\Http\Controllers\site;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use App\Models\Admin;
use Illuminate\Support\Facades\Log;

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
$adminId = Auth::guard('Admin')->id();

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
public function getProductsBySeller()
{
    $sellerId = Auth::guard('Admin')->id();
    $products = Product::where('created_by', $sellerId)->get();
    return response()->json( $products);
}
public function getAllSellerProducts()
{
    try {
        $products = Admin::where('type', 'S')->with('products')->get()
            ->flatMap(function ($seller) {
                return $seller->products->map(function ($product) use ($seller) {
                    $productData = $product->toArray();
                    $productData['seller_name'] = $seller->full_name; // or $seller->admin_name
                    return $productData;
                });
            })->values(); // Reset collection keys

        return response()->json($products);
    } catch (\Exception $e) {
        Log::error('Error fetching seller products: ' . $e->getMessage());

        return response()->json([
            'error' => true,
            'message' => $e->getMessage(),
        ], 500);
    }
}

}
