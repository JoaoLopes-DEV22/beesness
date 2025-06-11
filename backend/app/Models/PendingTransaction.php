<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PendingTransaction extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_pending_transaction';
    protected $fillable = [
        'value_pending_transaction',
        'fk_type_savings',
        'fk_pending'
    ];

    public function pending()
    {
        return $this->belongsTo(Pending::class, 'fk_pending');
    }

    public function type()
    {
        return $this->belongsTo(TypeSavings::class, 'fk_type_savings', 'id_type_savings');
    }
}
