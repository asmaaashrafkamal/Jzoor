<?php

namespace App\Http\Controllers\site;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use App\Models\Admin;
use App\Models\Order_Item;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
class ProductController extends Controller
{
    
public function getAllCatalog()
{
    $categories = Category::all()->map(function ($cat) {
        return [
            'name' => $cat->cat_name,
            'image' => $cat->image
                ? asset('storage/' . $cat->image)
                : 'https://placehold.co/100x100/E2E8F0/64748B?text=' . strtoupper(substr($cat->cat_name, 0, 2)),
        ];
    });

    $products = Product::whereNull('deleted_at')->get()->map(function ($product) {
        return [
            'name'  => $product->name,
            'price' => '$' . number_format($product->price ?? 0, 2),
            'image' => asset('storage/' . ($product->image ?? 'default.webp')),
        ];
    });

    return response()->json([
        'status'    => true,
        'categories' => $categories,
        'products'   => $products,
    ]);
}

    public function getBestSellers()
{
    $bestSellers = Order_Item::select('product_id', DB::raw('SUM(quantity) as totalOrder'))
        ->groupBy('product_id')
        ->orderByDesc('totalOrder')
        ->with('product')
        ->take(10)
        ->get()
        ->filter(fn($item) => $item->product) // skip missing products
        ->map(function ($item) {
            $product = $item->product;
            return [
                'name'       => $product->name,
                'totalOrder' => (int) $item->totalOrder,
                'status'     => ($product->stock ?? 0) > 0 ? 'Stock' : 'Stock out',
                'price'      => '$' . number_format($product->price ?? 0, 2),
                'image'      => asset('storage/' . ($product->image ?? 'default.webp')),
            ];
        })
        ->values(); // reindex

    return response()->json([
        'status' => true,
        'data'   => $bestSellers,
    ]);
}
    public function getTopProducts()
{
    $topProducts = Order_Item::select('product_id', DB::raw('SUM(quantity) as total_sold'))
        ->groupBy('product_id')
        ->orderByDesc('total_sold')
        ->take(5)
        ->with('product') // eager load product details
        ->get()
        ->map(function ($item) {
            return [
                'name'  => $item->product->name ?? 'Unknown',
                'item'  => $item->product->sku ?? 'N/A',
                'price' => '$' . number_format($item->product->price ?? 0, 2),
                'image' => asset('storage/' . ($item->product->image ?? 'default.webp')),
            ];
        });

    return response()->json([
        'status' => true,
        'data'   => $topProducts,
    ]);
}
public function store(Request $request)
{
   $validator = Validator::make($request->all(), [
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
        'image' => 'required|image|max:2048',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'errors' => $validator->errors()
        ], 422);
    }
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
public function getAllProducts(){
   $products = Product::where('status', 'accepted')->get();
    return response()->json( $products);
}
public function getProductsBySeller()
{
    $sellerId = Auth::guard('admin')->id();
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
public function getAllAdminSellerProducts()
{
    try {
      $products = Admin::where('type', 'S')->with('products')->get()
    ->flatMap(function ($seller) {
        return $seller->products
            ->whereIn('status', ['pending', 'rejected'])
            ->map(function ($product, $index) use ($seller) {
                return [
                    'no' => $index + 1,
                    'id' => '#DRD' . str_pad($product->id, 4, '0', STR_PAD_LEFT),
                    'product' => $product->name,
                    'date' => \Carbon\Carbon::parse($product->created_at)->format('m-d-Y'),
                    'price' => number_format($product->price, 2),
                    'qty' => $product->stock_quantity,
                    'status' => ucfirst($product->status),
                    'seller_name' => $seller->full_name, // or $seller->admin_name
                ];
            });
    })
    ->values(); // Reset collection keys

return response()->json($products);


    } catch (\Exception $e) {
        Log::error('Error fetching seller products: ' . $e->getMessage());

        return response()->json([
            'error' => true,
            'message' => $e->getMessage(),
        ], 500);
    }
}
public function destroy($id)
{
    $product = Product::find($id);

    if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
    }

    // Check for active orders
    $hasActiveOrders = Order_Item::where('product_id', $id)
        ->whereHas('order', function ($query) {
            $query->whereIn('status', ['pending', 'shipped', 'waiting to pickup']);
        })
        ->exists();

    if ($hasActiveOrders) {
        // Cancel related orders
        $orderIds = Order_Item::where('product_id', $id)
            ->pluck('order_id')
            ->unique();

        \App\Models\Order::whereIn('id', $orderIds)
            ->update(['status' => 'canceled']);
    }

    $product->delete(); // This now performs a soft delete

    return response()->json(['message' => 'Product soft-deleted and related orders (if any) were cancelled']);
}



public function update(Request $request, $id)
{
    $product = Product::findOrFail($id);

    $product->name = $request->input('product');
    $product->price = $request->input('price');
    $product->stock_quantity = $request->input('qty');

    if ($request->has('status')) {
        $product->status = Str::lower($request->input('status')); // store as lowercase
    }

    if ($request->has('stock_status')) {
        $stockStatus = strtolower($request->input('stock_status'));
        if ($stockStatus === 'out of stock') {
            $product->stock_status = 'Out of Stock';
        } else {
            $product->stock_status = 'In Stock';
        }
    }

    $product->save();

    return response()->json([
        'product' => [
            'id' => $product->id,
            'product' => $product->name,
            'qty' => $product->stock_quantity,
            'price' => $product->price,
            'status' => Str::ucfirst($product->status),         // e.g. "Pending"
            'stock_status' => $product->stock_status,           // formatted correctly
            'date' => $product->updated_at->toDateTimeString()
        ],
    ]);
}


}
