<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
  protected $fillable = [
        'name' ,'description','price' ,
        'discount','tax_included',
        'stock','stock_status',
        'highlight','tags',
        'image','category_id','created_by'
  ];
  public function category(){
        return $this->belongsTo('App\Models\Category','category_id','id');
    }
public function colors()
{
    return $this->hasMany(Product_Color::class);
}

public function sizes()
{
    return $this->hasMany(Product_Size::class);
}
public function creator()
{
    return $this->belongsTo(Admin::class, 'created_by');
}
}
