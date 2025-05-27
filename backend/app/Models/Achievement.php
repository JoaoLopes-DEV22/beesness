<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    use HasFactory;

    // Define o nome da tabela explicitamente
    protected $table = 'achievements';

    // Define a chave primária personalizada
    protected $primaryKey = 'id_achievement';

    // Define os atributos que podem ser preenchidos em massa
    protected $fillable = [
        'title_goal',
        'description_achievement',
        'experience_achievement',
        'sunflowers_achievement',
    ];

    
}

