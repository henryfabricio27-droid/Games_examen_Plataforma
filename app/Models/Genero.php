<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Genero extends Model
{
    use HasFactory;

    // 1. Mapeo de la tabla
    protected $table = 'generos';

    // 2. Asignación masiva
    protected $fillable = [
        'nombre',
        'slug'
    ];

    // 3. Relaciones

    // Un género tiene muchos juegos (N:N a través de juego_genero)
    public function juegos()
    {
        return $this->belongsToMany(Juego::class, 'juego_genero', 'genero_id', 'juego_id');
    }
}
