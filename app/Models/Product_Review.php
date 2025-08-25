<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Product_Review extends Model
{
    use HasFactory;
    use Notifiable;
    protected $table="product_reviews";
    protected $fillable = ['product_id', 'user_id', 'rating', 'review'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
