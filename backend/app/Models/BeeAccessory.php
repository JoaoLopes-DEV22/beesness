<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BeeAccessory extends Model
{
    use HasFactory;

    // Define o nome da tabela no banco de dados.
    // O Laravel inferiria 'bee_accessories' corretamente, mas é bom ser explícito.
    protected $table = 'bee_accessories';

    // Define a chave primária da tabela, se não for 'id'.
    // Sua migração usa 'id_bee_accessories'.
    protected $primaryKey = 'id_bee_accessories';

    // Define os atributos que podem ser preenchidos em massa (mass assignable).
    protected $fillable = [
        'fk_cosmetic_status',
        'fk_bee',
        'fk_accessory',
    ];

    // Relacionamento: Um registro de BeeAccessory pertence a um CosmeticStatus
    // Ou seja, um acessório que uma abelha possui tem um status (equipado/desequipado).
    public function cosmeticStatus()
    {
        return $this->belongsTo(CosmeticStatus::class, 'fk_cosmetic_status', 'id_cosmetic_status');
    }

    // Relacionamento: Um registro de BeeAccessory pertence a uma Bee
    // Indica a qual abelha este acessório pertence.
    public function bee()
    {
        return $this->belongsTo(Bee::class, 'fk_bee', 'id_bee');
    }

    // Relacionamento: Um registro de BeeAccessory pertence a um Accessory
    // Indica qual acessório específico está sendo associado.
    public function accessory()
    {
        return $this->belongsTo(Accessory::class, 'fk_accessory', 'id_accessory');
    }
}