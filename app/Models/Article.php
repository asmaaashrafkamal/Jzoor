<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;
// app/Models/Article.php
    protected $fillable = ['title', 'body', 'status', 'image','created_by'];

    public function admin(){
        return $this->belongsTo('App\Models\Admin','created_by','id');
    }
}