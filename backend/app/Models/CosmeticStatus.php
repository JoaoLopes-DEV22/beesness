<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CosmeticStatus extends Model
{
    use HasFactory;

    /**
     * O nome da tabela associada ao Model.
     * Por convenção, o Laravel pluraliza o nome do Model para encontrar a tabela.
     * No seu caso, 'CosmeticStatus' seria 'cosmetic_statuses', mas sua tabela é 'cosmetic_status'.
     * Portanto, é explícito para garantir a correta conexão.
     *
     * @var string
     */
    protected $table = 'cosmetic_status';

    /**
     * A chave primária da tabela.
     * Por padrão, o Laravel assume 'id'. Como você usa 'id_cosmetic_status',
     * precisamos especificar isso.
     *
     * @var string
     */
    protected $primaryKey = 'id_cosmetic_status';

    /**
     * Os atributos que são preenchíveis em massa (mass assignable).
     * Isso ajuda a prevenir a vulnerabilidade de "mass assignment".
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type_cosmetic_status', // O campo que armazena 'equipped', 'unequipped'
    ];

    /**
     * Define o relacionamento: Um CosmeticStatus pode ter muitos BeeAccessory.
     * Isso significa que um status (ex: 'equipped') pode ser aplicado a vários
     * registros de acessórios de abelha na tabela 'bee_accessories'.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function beeAccessories()
    {
        // hasMany(ModelFilho::class, 'chave_estrangeira_no_filho', 'chave_primaria_no_pai')
        // CosmeticStatus (pai) -> BeeAccessory (filho)
        // 'fk_cosmetic_status' é a coluna em 'bee_accessories' que referencia 'id_cosmetic_status'
        return $this->hasMany(BeeAccessory::class, 'fk_cosmetic_status', 'id_cosmetic_status');
    }
}