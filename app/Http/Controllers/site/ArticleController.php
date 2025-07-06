<?php

namespace App\Http\Controllers\site;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;
class ArticleController extends Controller
{
public function store(Request $request)
{
try{
    // 1. Validate the incoming data
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'body' => 'required|string',
        'status' => 'required|in:Published,Drafted,Status',
        'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:10240', // 10MB max
    ]);

    // 2. Handle image upload if present
    if ($request->hasFile('image')) {
        $validated['image'] = $request->file('image')->store('articles', 'public');
    }

    // 3. Set created_by from authenticated admin
    $validated['created_by'] = Auth::guard('Admin')->id(); // ensure 'admin' guard is set in auth config
if (!Auth::guard('Admin')->id()) {
    return response()->json(['error' => 'Admin not authenticated'], 401);
}
    // 4. Create the article
    $article = Article::create($validated);

    // 5. Return response
    return response()->json([
        'message' => 'Article created successfully!',
        'article' => $article,
    ], 201);
} catch (\Illuminate\Validation\ValidationException $e) {
    return response()->json([
        'message' => 'Validation failed',
        'errors' => $e->errors(),
    ], 422);
}
}
}
