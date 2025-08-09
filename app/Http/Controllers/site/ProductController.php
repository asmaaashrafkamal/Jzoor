<?php

namespace App\Http\Controllers\site;
use Carbon\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Product_Review;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use App\Models\Admin;
use App\Models\Order_Item;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
    // dd(session()->all());

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
    if (session('admin_type') === 'A') {
        $product->status="accepted";
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
public function getAllProductSeller(){
    $products = Product::where('status', 'accepted')
    ->where('created_by', session('admin_id'))
    ->get();
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
public function getAllAdminSellerProductDashboard()
{
    try {
        $adminId = session('admin_id');

        $products = Admin::where('type', 'S')
            ->with(['products' => function ($query) use ($adminId) {
                $query->whereIn('status', ['pending', 'rejected'])
                      ->where('created_by', $adminId); // ✅ Filter by creator
            }])
            ->get()
            ->flatMap(function ($seller) {
                return $seller->products
                    ->map(function ($product, $index) use ($seller) {
                        return [
                            'no' => $index + 1,
                            'id' => '#DRD' . str_pad($product->id, 4, '0', STR_PAD_LEFT),
                            'product' => $product->name,
                            'date' => \Carbon\Carbon::parse($product->created_at)->format('m-d-Y'),
                            'price' => $product->price,
                            'qty' => $product->stock_quantity,
                            'status' => ucfirst($product->status),
                            'seller_name' => $seller->full_name,
                        ];
                    });
            })
            ->values();

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

// Get reviews for a product
public function getProductReviews($productId)
{
    $reviews = Product_Review::with('user')->where('product_id', $productId)->latest()->get();
    return response()->json($reviews);
}

// Store a review
public function storeReview(Request $request)
{
    $validated = $request->validate([
        'product_id' => 'required|exists:products,id',
        'rating' => 'required|integer|min:1|max:5',
        'review' => 'nullable|string',
    ]);

    $user = Auth::user();

    $review = Product_Review::create([
        'product_id' => $validated['product_id'],
        'user_id' => $user->id,
        'rating' => $validated['rating'],
        'review' => $validated['review'],
    ]);

    return response()->json($review, 201);
}

public function getAllReviews()
{
    $reviews = Product_Review::with(['user', 'product'])
        ->latest()
        ->get();

    $formatted = $reviews->map(function ($review, $index) {
        return [
            'no' => $index + 1,
            'id' => $review->id,
            'productId' => '#ORD0000' . $review->product->id ?? '#ORD0000',
            'reviewer' => $review->user->full_name ?? 'Anonymous',
            'rate' => $review->rating,
            'date' => Carbon::parse($review->created_at)->format('d M Y'),
            'status' => $review->rating >= 4 ? 'Positive' : 'Negative',
            'comment' => $review->review,

        ];
    });

    return response()->json($formatted);
}
public function getTopProduct()
{
    $reviews = Product_Review::with('product')
        ->latest()
        ->get()
        ->unique('product_id') // Get unique products only
        ->values(); // Reset keys

    $topProducts = $reviews->map(function ($review) {
        $product = $review->product;
        if (!$product) return null; // in case product is soft-deleted or null

        return [
            'image'   => $product->image ? Storage::url($product->image) : asset('images/default.jpg'),
            'name'    => $product->name,
            'id'      => '#ORD0000' . $product->id, // Appending to ID
            'rating'  => $product->averageRating(),
            'reviews' => $product->totalReviews(),
        ];
    })->filter(); // remove nulls if any

    return response()->json($topProducts);
}
public function destroyReview($id)
{
    $review = Product_Review::find($id);

    if (!$review) {
        return response()->json(['message' => 'Review not found'], 404);
    }

    $review->delete();

    return response()->json(['message' => 'Review deleted successfully']);
}
public function getAllReviewSeller()
{
    $reviews = Product_Review::with(['user', 'product'])
    ->whereHas('product', function ($query) {
        $query->where('created_by', session('admin_id'));
    })
    ->latest()
    ->get();

    $formatted = $reviews->map(function ($review, $index) {
        return [
            'no' => $index + 1,
            'id' => $review->id,
            'productId' => '#ORD0000' . $review->product->id ?? '#ORD0000',
            'reviewer' => $review->user->full_name ?? 'Anonymous',
            'rate' => $review->rating,
            'date' => Carbon::parse($review->created_at)->format('d M Y'),
            'status' => $review->rating >= 4 ? 'Positive' : 'Negative',
            'comment' => $review->review,

        ];
    });

    return response()->json($formatted);
}
public function getTopProductSeller()
{
    $reviews = Product_Review::with('product')
    ->whereHas('product', function ($query) {
        $query->where('created_by', session('admin_id'));
    })
    ->latest()
    ->get()
    ->unique('product_id') // Only one review per product
    ->values(); // Reset array keys

    $topProducts = $reviews->map(function ($review) {
        $product = $review->product;
        if (!$product) return null; // in case product is soft-deleted or null

        return [
            'image'   => $product->image ? Storage::url($product->image) : asset('images/default.jpg'),
            'name'    => $product->name,
            'id'      => '#ORD0000' . $product->id, // Appending to ID
            'rating'  => $product->averageRating(),
            'reviews' => $product->totalReviews(),
        ];
    })->filter(); // remove nulls if any

    return response()->json($topProducts);
}
}
