<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Crear Plataformas
        $pc = \App\Models\Plataforma::create(['nombre' => 'PC', 'slug' => 'pc']);
        $ps5 = \App\Models\Plataforma::create(['nombre' => 'PlayStation 5', 'slug' => 'ps5']);
        $xbox = \App\Models\Plataforma::create(['nombre' => 'Xbox Series X', 'slug' => 'xbox']);
        $nintendo = \App\Models\Plataforma::create(['nombre' => 'Nintendo Switch', 'slug' => 'switch']);
    
        // 2. Crear Géneros
        $accion = \App\Models\Genero::create(['nombre' => 'Acción', 'slug' => 'accion']);
        $rpg = \App\Models\Genero::create(['nombre' => 'RPG', 'slug' => 'rpg']);
        $estrategia = \App\Models\Genero::create(['nombre' => 'Estrategia', 'slug' => 'estrategia']);
        $aventura = \App\Models\Genero::create(['nombre' => 'Aventura', 'slug' => 'aventura']);
        $deportes = \App\Models\Genero::create(['nombre' => 'Deportes', 'slug' => 'deportes']);
    
        // 3. Crear Juegos
        $juegos = [
            [
                'titulo' => 'Elden Ring',
                'descripcion_corta' => 'Aventura RPG desafiante',
                'descripcion_larga' => 'Elden Ring es un juego de rol de acción de gran dificultad que destaca por su mundo abierto y su mecánica de combate exigente.',
                'precio_normal' => 59.99,
                'plataforma_id' => $ps5->id,
                'generos' => [$accion->id, $rpg->id, $aventura->id],
                'activo' => true
            ],
            [
                'titulo' => 'Baldur\'s Gate 3',
                'descripcion_corta' => 'RPG narrativo con infinitas posibilidades',
                'descripcion_larga' => 'Un RPG épico con decisiones que definen tu historia. Juega como quieras con libertad total.',
                'precio_normal' => 59.99,
                'precio_oferta' => 39.99,
                'plataforma_id' => $pc->id,
                'generos' => [$rpg->id, $aventura->id],
                'activo' => true,
                'destacada' => true
            ],
            [
                'titulo' => 'StarCraft II',
                'descripcion_corta' => 'Estrategia clásica competitiva',
                'descripcion_larga' => 'El mejor juego de estrategia en tiempo real. Compite en la Liga Global de StarCraft II.',
                'precio_normal' => 0,
                'plataforma_id' => $pc->id,
                'generos' => [$estrategia->id],
                'activo' => true
            ],
            [
                'titulo' => 'The Legend of Zelda: Breath of the Wild',
                'descripcion_corta' => 'Aventura épica en mundo abierto',
                'descripcion_larga' => 'Explora Hyrule en esta revolucionaria aventura de mundo abierto que cambió los videojuegos.',
                'precio_normal' => 59.99,
                'plataforma_id' => $nintendo->id,
                'generos' => [$aventura->id, $accion->id],
                'activo' => true
            ],
            [
                'titulo' => 'Halo Infinite',
                'descripcion_corta' => 'Shooter futurista multijugador',
                'descripcion_larga' => 'El último capítulo de la saga Halo trae combates frenéticos y gráficos de nueva generación.',
                'precio_normal' => 59.99,
                'plataforma_id' => $xbox->id,
                'generos' => [$accion->id],
                'activo' => true
            ],
            [
                'titulo' => 'FIFA 24',
                'descripcion_corta' => 'Simulador de fútbol número 1',
                'descripcion_larga' => 'Juega con tus equipos favoritos en el simulador de fútbol más realista del mercado.',
                'precio_normal' => 69.99,
                'precio_oferta' => 49.99,
                'plataforma_id' => $ps5->id,
                'generos' => [$deportes->id],
                'activo' => true
            ],
            [
                'titulo' => 'Starfield',
                'descripcion_corta' => 'Exploración espacial sin límites',
                'descripcion_larga' => 'Un universo gigantesco esperando ser explorado. Crea tu propia historia en el espacio.',
                'precio_normal' => 69.99,
                'plataforma_id' => $xbox->id,
                'generos' => [$rpg->id, $aventura->id],
                'activo' => true,
                'destacada' => true
            ],
            [
                'titulo' => 'Cyberpunk 2077',
                'descripcion_corta' => 'RPG futurista en megaciudad',
                'descripcion_larga' => 'Vive una historia inmersiva en Night City, una megaciudad llena de intriga y peligro.',
                'precio_normal' => 59.99,
                'plataforma_id' => $pc->id,
                'generos' => [$rpg->id, $accion->id],
                'activo' => true
            ]
        ];

        foreach ($juegos as $juegoData) {
            $generos = $juegoData['generos'];
            unset($juegoData['generos']);
            
            $juego = \App\Models\Juego::create($juegoData);
            $juego->generos()->attach($generos);
        }
    
        // 4. Crear Usuarios de Demo
        \App\Models\User::create([
            'name' => 'Administrador',
            'email' => 'admin@gamezone.com',
            'password' => bcrypt('password123'),
            'role' => 'admin'
        ]);

        \App\Models\User::create([
            'name' => 'Usuario',
            'email' => 'user@gamezone.com',
            'password' => bcrypt('password123'),
            'role' => 'user'
        ]);
    }
}