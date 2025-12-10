<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('juegos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('descripcion_corta') ->nullable();
            $table->text('descripcion_larga') ->nullable();
            
            //Precios
            $table->decimal('precio_normal', 8, 2) -> nullable();
            $table->decimal('precio_oferta', 8, 2) -> nullable();

            //firebase estorage
            $table->string('imagen_url', 500) -> nullable();
           
            // Estado
            $table->boolean('destacada') -> default(False);
            $table->boolean('activo') -> default(True);

            //RELACION CON LA PLATAFORMA 
            $table->foreignId('plataforma_id')
            -> nullable()
            -> constrained('plataformas')
            ->nullOnDelete(); // si se borra la plataforma, 
            // el juego se queda sin plataforma 

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('juegos');
    }
};
