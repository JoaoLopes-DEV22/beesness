<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Type extends Model
{
    use HasFactory;

    protected $table = 'types';
    protected $primaryKey = 'id_type';

    protected $fillable = [
        'name_type',
    ];

    public function category()
    {
        return $this->hasMany(Category::class, 'fk_type', 'id_type');
    }

    public function transaction()
    {
        return $this->hasMany(Transaction::class, 'fk_type', 'id_type');
    }
}
