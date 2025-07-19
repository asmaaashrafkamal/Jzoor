<?php

namespace App\Http\Controllers\site;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Validator; // ✅ This is required

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

    public function destroy($id) {
        Category::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
