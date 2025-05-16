<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Category extends Model
{
    use HasFactory;
    protected $table = 'categories';
    protected $primaryKey = 'id_category';
    protected $fillable = [
        'title_category',
        'color_category',
        'fk_type',
        'fk_account',
    ];
    public function type()
    {
        return $this->belongsTo(Type::class, 'fk_type', 'id_type');
    }

    public function account()
    {
        return $this->belongsTo(Account::class, 'fk_account', 'id_account');
    }

    public function transaction()
    {
        return $this->hasMany(Transaction::class, 'fk_category', 'id_category');
    }
}