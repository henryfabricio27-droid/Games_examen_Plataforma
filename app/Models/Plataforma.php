<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Plataforma extends Model
{
  use HasFactory;

  //1.mapeo de la tabla
    protected $table = 'plataformas';

    //asignacion masiva
    protected $fillable = ['nombre','slug',];

    //relaciones
    //relacion de 1 a N con juegos

    public function juegos()
    {
        return $this->hasMany(Juego::class, 'plataforma_id');
    }

}
