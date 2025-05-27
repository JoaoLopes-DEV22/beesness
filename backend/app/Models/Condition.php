<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Condition extends Model
{
    use HasFactory;

    protected $table = 'conditions';
    protected $primaryKey = 'id_condition';

    protected $fillable = [
        'title_condition',
    ];

    public function pending()
    {
        return $this->belongsTo(Pending::class, 'fk_condition', 'id_condition');
    }

}
