<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $table = 'transactions';
    protected $primaryKey = 'id_transaction';

    protected $fillable = [
        'title_transaction',
        'value_transaction',
        'fk_type',
        'fk_category',
        'fk_account',
    ];

    public function type()
    {
        return $this->belongsTo(Type::class, 'fk_type', 'id_type');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'fk_category', 'id_category');
    }

    public function account()
    {
        return $this->belongsTo(Account::class, 'fk_account', 'id_account');
    }
}

