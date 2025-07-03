<?php

namespace App\Http\Controllers\site;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
class CategoryController extends Controller
{
 public function store(Request $request){
         $validated = $request->validate([
        'cat_name' => 'required|string|max:255',
        'description' => 'required|string',
        'productNo' => 'required|integer|min:0',
        'image' => 'nullable|url',
        ]);
     $category = Category::create([
        'cat_name'        => $validated['cat_name'],
        'description' => $validated['description'],
        'productNo'  => $validated['productNo'],
        'image'       => $validated['image'] ?? null,
        'created_by'=>  1 ,
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