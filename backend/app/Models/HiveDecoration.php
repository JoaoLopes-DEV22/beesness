<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HiveDecoration extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'hive_decorations';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'id_hive_decoration';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'position_hive_decoration',
        'fk_cosmetic_status',
        'fk_decoration',
        'fk_account',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        // Se 'position_hive_decoration' for um enum string, não precisa de cast especial aqui,
        // mas você pode definir se for necessário para outros tipos.
    ];

    /**
     * Get the decoration that owns the hive decoration.
     */
    public function decoration()
    {
        return $this->belongsTo(Decoration::class, 'fk_decoration', 'id_decoration');
    }

    /**
     * Get the account that owns the hive decoration.
     */
    public function account()
    {
        return $this->belongsTo(Account::class, 'fk_account', 'id_account');
    }

    /**
     * Get the cosmetic status associated with the hive decoration.
     */
    public function cosmeticStatus()
    {
        return $this->belongsTo(CosmeticStatus::class, 'fk_cosmetic_status', 'id_cosmetic_status');
    }
}