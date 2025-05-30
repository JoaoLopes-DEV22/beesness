<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoalTransaction extends Model
{
    use HasFactory;

    protected $table = 'goal_transactions';
    protected $primaryKey = 'id_goal_transaction';

    protected $fillable = [
        'value_goal_transaction',
        'fk_type_savings',
        'fk_goal'
    ];

    public function goal()
    {
        return $this->belongsTo(Goal::class, 'fk_goal', 'id_goal');
    }

    public function type()
    {
        return $this->belongsTo(TypeSavings::class, 'fk_type_savings', 'id_type_savings');
    }
}