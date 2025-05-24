<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bee extends Model
{
    use HasFactory;

    protected $table = 'bees';
    protected $primaryKey = 'id_bee';

    protected $fillable = [
        'name_bee',
        'experience_bee',
        'level_bee',
        'fk_account',
    ];

    // Relacionamento com a conta
    public function account()
    {
        return $this->belongsTo(Account::class, 'fk_account', 'id_account');
    }

     public function beeAccessories()
    {
        return $this->hasMany(BeeAccessory::class, 'fk_bee', 'id_bee');
    }

    
}
