<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use HasFactory;

    protected $table = 'goals';
    protected $primaryKey = 'id_goal';

    protected $fillable = [
        'title_goal',
        'value_goal',
        'target_goal',
        'deadline_goal',
        'fk_condition',
        'fk_account'
    ];

    public function account()
    {
        return $this->belongsTo(Account::class, 'fk_account', 'id_account');
    }

    public function condition()
    {
        return $this->belongsTo(Condition::class, 'fk_condition', 'id_condition');
    }

    public function transactions()
    {
        return $this->hasMany(GoalTransaction::class, 'fk_goal', 'id_goal');
    }
}