<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavingsTransaction extends Model
{
    use HasFactory;

    protected $table = 'savings_transactions';
    protected $primaryKey = 'id_savings_transaction';

    protected $fillable = [
        'value_savings_transaction',
        'fk_type_savings',
        'fk_savings',
    ];

    public function typeSavings()
    {
        return $this->belongsTo(TypeSavings::class, 'fk_type_savings', 'id_type_savings');
    }

    public function savings()
    {
        return $this->belongsTo(Savings::class, 'fk_savings', 'id_savings');
    }
}