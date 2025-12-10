<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Juego extends Model
{
    use HasFactory;

    // 1. Mapeo de la tabla
    protected $table = 'juegos';

    protected $fillable = [
        'titulo',
        'descripcion_corta',
        'descripcion_larga',
        'precio_normal',
        'precio_oferta',
        'imagen_url',
        'destacada',
        'activo',
        'plataforma_id' // Importante para poder asignar la FK
    ];

    // 3. Relaciones

    // Un juego pertenece a una plataforma (N a 1)
    public function plataforma()
    {
        return $this->belongsTo(Plataforma::class, 'plataforma_id');
    }

    // Relación N:N con Genero
    public function generos()
    {
        return $this->belongsToMany(Genero::class, 'juego_genero', 'juego_id', 'genero_id');
    }
}
