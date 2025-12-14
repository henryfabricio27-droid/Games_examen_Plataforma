<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comentario extends Model
{
    protected $fillable = ['user_id', 'juego_id', 'contenido', 'calificacion'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function juego()
    {
        return $this->belongsTo(Juego::class);
    }
}
