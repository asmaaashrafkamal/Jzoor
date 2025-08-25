<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Order extends Model
{
    use HasFactory;
    use Notifiable;

  protected $fillable = ['user_id', 'total_price', 'status','delivery_person_id','shipping_price'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(Order_Item::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
public function deliveryPerson()
{
    return $this->belongsTo(Admin::class, 'delivery_person_id')->where('type', 'D');
}
}
