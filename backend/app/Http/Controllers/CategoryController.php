<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // public function index()
    // {
    //     return Category::all();
    // }

    public function index(Request $request)
    {
        $userId = $request->query('user_id'); // Obtém o ID do usuário da query string

        if (!$userId) {
            return response()->json(['message' => 'user_id é obrigatório'], 400);
        }

        // Retorna apenas as categorias que pertencem ao usuário logado
        return Category::where('fk_account', $userId)->get();
    }


    public function store(Request $request)
    {
        $request->validate([
            'title_category' => 'required|string|max:100',
            'color_category' => 'required|string|max:7',
            'fk_type' => 'required|exists:types,id_type',
            'fk_account' => 'required|exists:accounts,id_account'
        ]);

        try {
            $category = Category::create($request->all());
            return response()->json($category, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao criar categoria: ' . $e->getMessage()], 500);
        }
    }
}
