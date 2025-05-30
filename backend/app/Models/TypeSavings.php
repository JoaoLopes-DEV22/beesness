<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeSavings extends Model
{
    use HasFactory;

    protected $table = 'types_savings';
    protected $primaryKey = 'id_type_savings';

    protected $fillable = [
        'name_type_savings',
    ];

    public function savingsTransaction()
    {
        return $this->hasMany(SavingsTransaction::class, 'fk_type_savings', 'id_type_savings');
    }

}
