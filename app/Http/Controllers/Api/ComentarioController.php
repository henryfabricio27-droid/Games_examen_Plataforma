<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comentario;
use App\Models\Juego;
use Illuminate\Http\Request;

class ComentarioController extends Controller
{
    /**
     * Obtener comentarios de un juego
     */
    public function index($juegoId)
    {
        $juego = Juego::findOrFail($juegoId);
        $comentarios = $juego->comentarios()->with('user')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $comentarios,
        ], 200);
    }

    /**
     * Crear un nuevo comentario
     */
    public function store(Request $request, $juegoId)
    {
        $juego = Juego::findOrFail($juegoId);

        $validated = $request->validate([
            'contenido' => 'required|string|min:5|max:500',
            'calificacion' => 'required|integer|min:1|max:5',
        ]);

        $comentario = $juego->comentarios()->create([
            'user_id' => auth()->id(),
            'contenido' => $validated['contenido'],
            'calificacion' => $validated['calificacion'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $comentario->load('user'),
        ], 201);
    }

    /**
     * Eliminar un comentario
     */
    public function destroy($comentarioId)
    {
        $comentario = Comentario::findOrFail($comentarioId);

        // El usuario solo puede eliminar su propio comentario, excepto admin
        if ($comentario->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permiso para eliminar este comentario',
            ], 403);
        }

        $comentario->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comentario eliminado',
        ], 200);
    }
}
