<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
 protected $fillable=['id','cat_name',
    'created_by','description','status',
    'productNo'];

//relations
    public function admin(){
        return $this->belongsTo('App\Models\Admin','created_by','id');
    }
}