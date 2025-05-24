<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accessory extends Model
{
    protected $table = 'accessories';
    protected $primaryKey = 'id_accessory';

    protected $fillable = [
        'name_accessory',
        'price_accessory',
        'icon_accessory',
        'img_accessory',
        'level_accessory',
        'type_accessory',
    ];
}
