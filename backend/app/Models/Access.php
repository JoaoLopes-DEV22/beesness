<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Access extends Model
{
    use HasFactory;

    // Define o nome da tabela associada ao modelo, caso não siga a convenção de nomes plurais
    protected $table = 'access';

    // Define a chave primária da tabela, caso não seja 'id'
    protected $primaryKey = 'id_access';

    // Define os atributos que podem ser preenchidos em massa (mass assignable)
    protected $fillable = [
        'date_access',
        'fk_account',
    ];

    /**
     * Define o tipo de dado para a coluna date_access.
     * Necessário para que o Laravel trate como Carbon (objeto de data)
     * @var array
     */
    protected $casts = [
        'date_access' => 'date',
    ];

    // Se você não quiser usar os campos created_at e updated_at, defina como false
    // public $timestamps = false; // Mantenha como true para sua migração

    /**
     * Define o relacionamento com o modelo Account.
     * Um acesso pertence a uma conta (usuário).
     */
    public function account()
    {
        return $this->belongsTo(Account::class, 'fk_account', 'id_account');
    }
}