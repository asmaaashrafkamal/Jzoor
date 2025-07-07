<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

use Illuminate\Database\Eloquent\Model;

class Admin extends Authenticatable
{
 use HasFactory, Notifiable;
    const ADMIN_TYPE = "A";
    const SELLER_TYPE = "S";
    const DELIVERY_TYPE = "D";
    protected $fillable=['id','full_name',
    'email','password','image','state','status','address','gender',
    'type'];

//relations
    public function categories(){
        return $this->hasMany('App\Models\Category','created_by','id');
    }
    public function isSeller()
    {
        return $this->type === 'seller';
    }
   public function products(){
        return $this->hasMany('App\Models\Product','category_id','id');
    }
   public function articles(){
        return $this->hasMany('App\Models\Article','created_by','id');
    }
}