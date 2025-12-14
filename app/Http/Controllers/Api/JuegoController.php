<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Juego;

//use App\Services\FirebaseService;

class JuegoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    //protected $firebaseService;

    public function __construct()
    {
        //$this->firebaseService = $firebaseService;
    }

    //GET
    public function index(Request $request)
    {
        $query = Juego::with(['plataforma', 'generos'])->where('activo', true);

        if ($request->has('buscar')) {
            $termino = $request->input('buscar');
            $query->where('titulo', 'LIKE', '%' . $termino . '%');
        }

        $juegos = $query->orderBy('created_at', 'desc')->get(); 
        
        return response()->json([
            'success' => true,
            'data' => $juegos,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */

    //POST
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion_corta' => 'nullable|string',
            'descripcion_larga' => 'nullable|string',
            'precio_normal' => 'required|numeric',
            'precio_oferta' => 'nullable|numeric|lt:precio_normal',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'destacada' => 'boolean',
            'activo' => 'boolean',
            'plataforma_id' => 'required|exists:plataformas,id',
            'generos' => 'array',
            'generos.*' => 'exists:generos,id'
        ]);
//manejo de la imagen
        $data = $request->all();

        // if ($request->hasFile('imagen')) {
        //     $url = $this->firebaseService->uploadImage($request->file('imagen'), 'juegos');
        //     $data['imagen_url'] = $url;
        // }

        $juego = Juego::create($data);

        if ($request->has('generos')) {
            $juego->generos()->sync($request->input('generos'));
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Juego creado correctamente',
            'data' => $juego->load('generos')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $juego = Juego::with(['plataforma', 'generos'])->where('activo', true)->find($id);

        if (!$juego) {
            return response()->json([
                'success' => false,
                'message' => 'Juego no encontrado'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $juego
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $juego = Juego::find($id);

        if (!$juego) {
            return response()->json([
                'success' => false,
                'message' => 'Juego no encontrado'
            ], 404);
        }

        $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'descripcion_corta' => 'sometimes|nullable|string',
            'descripcion_larga' => 'sometimes|nullable|string',
            'precio_normal' => 'sometimes|required|numeric',
            'precio_oferta' => 'sometimes|nullable|numeric|lt:precio_normal',
            'imagen' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'destacada' => 'sometimes|boolean',
            'activo' => 'sometimes|boolean',
            'plataforma_id' => 'sometimes|required|exists:plataformas,id',
            'generos' => 'sometimes|array',
            'generos.*' => 'exists:generos,id'
        ]);

        $data = $request->all();
        // if ($request->hasFile('imagen')) {
        //     $url = $this->firebaseService->uploadImage($request->file('imagen'), 'juegos');
        //     $data['imagen_url'] = $url;
        // }
        //eliminar imagen anterior en firebase si se actualiza
        $juego->update($data);
        if ($request->has('generos')) {
            $juego->generos()->sync($request->input('generos'));
        }

        return response()->json([
            'success' => true,
            'message' => 'Juego actualizado correctamente',
            'data' => $juego->load('generos')
        ], 200);

    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $juego = Juego::find($id);

        if (!$juego) {
            return response()->json([
                'success' => false,
                'message' => 'Juego no encontrado'
            ], 404);
        }

        $juego->delete();

        return response()->json([
            'success' => true,
            'message' => 'Juego eliminado correctamente'
        ], 200);
    }
}
