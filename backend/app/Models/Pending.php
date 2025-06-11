<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pending extends Model
{
    use HasFactory;

    protected $table = 'pendings';
    protected $primaryKey = 'id_pending';

    protected $fillable = [
        'title_pending',
        'initial_pending',
        'total_pending',
        'deadline_pending',
        'fk_type',
        'fk_category',
        'fk_account',
        'fk_condition',
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

    public function condition()
    {
        return $this->belongsTo(Condition::class, 'fk_condition', 'id_condition');
    }

    public function transactions()
    {
        return $this->hasMany(PendingTransaction::class, 'fk_pending');
    }
}
