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
    'email','password','image','state','status','address','gender','phone','Birth_date',
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
        return $this->hasMany('App\Models\Product','created_by','id');
    }
   public function orders(){
        return $this->hasMany('App\Models\Order','delivery_person_id','id');
    }
   public function articles(){
        return $this->hasMany('App\Models\Article','created_by','id');
    }
}
