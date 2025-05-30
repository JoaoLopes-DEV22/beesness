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

    public function categories() // Mudei para plural e para hasMany
    {
        return $this->hasMany(Category::class, 'fk_account', 'id_account');
    }

    public function bee()
    {
        return $this->hasOne(Bee::class, 'fk_account');
    }

    public function accountAchievements()
    {
        return $this->hasMany(AccountAchievement::class, 'fk_account', 'id_account');
    }

    // public function transactions()
    // {
    //     return $this->hasMany(Transaction::class, 'fk_account', 'id_transaction');
    // }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'fk_account', 'id_account');
    }

    public function pendings()
    {
        return $this->hasMany(Pending::class, 'fk_account', 'id_account');
    }

    public function savings()
    {
        return $this->hasOne(Savings::class, 'fk_account');
    }

    public function hiveDecorations()
    {
        return $this->hasMany(HiveDecoration::class, 'fk_account', 'id_account');
    }

    public function beeAccessories()
    {
        return $this->hasMany(BeeAccessory::class, 'fk_account', 'id_account');
    }
}
