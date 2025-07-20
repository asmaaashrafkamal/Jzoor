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
        'image' => 'required|image|mimes:jpg,jpeg,png,gif|max:10240', // 10MB max
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
  public function index(Request $request)
{
    $query = Article::query();

    if ($request->search) {
        $query->where('title', 'like', '%' . $request->search . '%');
    }

    if ($request->status && $request->status !== 'all') {
        $query->where('status', $request->status);
    }

    return response()->json($query->paginate(10));
}

    // GET /api/articles/{id}
    public function show($id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        return response()->json($article);
    }
  public function update(Request $request, $id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:Published,Drafted,Canceled',
        ]);

        $article->status = $validated['status'];
        $article->save();

        return response()->json(['message' => 'Status updated successfully']);
    }

    // DELETE /api/articles/{id}
    public function destroy($id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        $article->delete();

        return response()->json(['message' => 'Article deleted successfully']);
    }
}
