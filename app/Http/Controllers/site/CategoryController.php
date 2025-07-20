<?php

namespace App\Http\Controllers\site;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Validator; // ✅ This is required
use App\Models\Order;
use App\Models\Order_Item;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
class CategoryController extends Controller
{
public function store(Request $request)
{
    $validated = $request->validate([
        'cat_name' => [
            'required',
            'string',
            'max:255',
            'unique:categories,cat_name'
        ],
        'description' => 'required|string',
        'productNo' => 'required|integer|min:0',
        'image' => 'nullable|url',
        'created_by' => 'required|exists:admins,id', // check if exists
    ]);
    $category = Category::create([
        'cat_name'    => $validated['cat_name'],
        'description' => $validated['description'],
        'productNo'   => $validated['productNo'],
        'image'       => $validated['image'] ?? null,
        'created_by' => $validated['created_by'],
    ]);

    return response()->json(['message' => 'Category created', 'category' => $category], 201);
}

public function getCat() {
        $category = Category::all();
        return response()->json($category);
    }

public function update(Request $request, $id) {
        $category = Category::findOrFail($id);
        $category->update($request->all());
        return response()->json($category);
    }

public function destroy($id)
{
    DB::beginTransaction();

    try {
        $category = Category::findOrFail($id);

        // Get all product IDs in this category
        $productIds = Product::where('category_id', $id)->pluck('id');

        // Find all order items with these product IDs
        $orderItemIds = Order_Item::whereIn('product_id', $productIds)->pluck('order_id');

        // Cancel the affected orders (e.g., set status to 'cancelled')
        Order::whereIn('id', $orderItemIds)->update(['status' => 'Canceled']);

        // Delete all products in the category
        Product::whereIn('id', $productIds)->delete();

        // Delete the category
        $category->delete();

        DB::commit();

        return response()->json(['message' => 'Category, its products, and related orders were handled successfully.'], 200);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => 'Failed to delete category: ' . $e->getMessage()], 500);
    }
}

}
