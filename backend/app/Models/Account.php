<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    protected $table = 'accounts';
    protected $primaryKey = 'id_account';

    protected $fillable = [
        'incomes_account',
        'expenses_account',
        'balance_account',
        'sunflowers_account',
        'fk_user',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'fk_user', 'id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'fk_account', 'id_account');
    }

    public function bee()
    {
        return $this->hasOne(Bee::class, 'fk_account');
    }
}
