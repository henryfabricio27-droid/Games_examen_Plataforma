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
    //relacion de N a M con juegos

    public function juegos()
    {
                                  //modelo,foreingn key
      return $this->belongsToMany(Juego::class,'juego_genero','plataforma_id','juego_id');
    }

}
