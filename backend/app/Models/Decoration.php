<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Decoration extends Model
{
    use HasFactory;

    protected $table = 'decorations';
    protected $primaryKey = 'id_decoration';

    protected $fillable = [
        'name_decoration',
        'price_decoration',
        'icon_decoration',
        'img_decoration',
        'level_decoration',
    ];


}