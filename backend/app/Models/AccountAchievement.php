<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountAchievement extends Model
{
    use HasFactory;

    protected $table = 'account_achievements'; // Nome exato da sua tabela

    protected $primaryKey = 'id_account_achievement'; // Se você insiste em manter o nome antigo

    protected $fillable = [
        'fk_account',
        'fk_achievements',
        'is_completed',
        'is_claimed',
        'completed_at',
        'claimed_at',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'is_claimed' => 'boolean',
        'completed_at' => 'datetime',
        'claimed_at' => 'datetime',
    ];

    // Relacionamento com o modelo Account (assumindo que você tem um Account.php)
    public function account()
    {
        return $this->belongsTo(Account::class, 'fk_account', 'id_account');
    }

    // Relacionamento com o modelo Achievement
    public function achievement()
    {
        return $this->belongsTo(Achievement::class, 'fk_achievements', 'id_achievement');
    }
}