<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Savings extends Model
{
    use HasFactory;

    protected $table = 'savings';
    protected $primaryKey = 'id_savings';

    protected $fillable = [
        'balance_savings',
        'tax_savings',
        'fk_account',
    ];

    // Relacionamentos
    public function account()
    {
        return $this->belongsTo(Account::class, 'fk_account', 'id_account');
    }

    public function savingsTransactions()
    {
        return $this->hasMany(SavingsTransaction::class, 'fk_savings', 'id_savings');
    }
}