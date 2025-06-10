<?php

namespace App\Http\Controllers;

use App\Models\Pending;
use Illuminate\Http\Request;
use Carbon\Carbon; // Adicionar o uso de Carbon

class PendingController extends Controller
{
    public function getMonthlyPendingsData(Request $request)
    {
        $userId = $request->query('user_id');
        $month = $request->query('month');

        if (!$userId || !$month) {
            return response()->json(['message' => 'user_id e month são obrigatórios'], 400);
        }

        $startDate = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
        $endDate = Carbon::createFromFormat('Y-m', $month)->endOfMonth();

        $pendings = Pending::where('fk_account', $userId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->with('category')
            ->get();

        // Calcula o total de receitas pendentes (fk_type = 1)
        $totalReceitasPendentes = $pendings->filter(function ($pending) {
            return $pending->category && $pending->category->fk_type === 1 && $pending->fk_condition === 1;
        })->sum('value_pending');

        // Calcula o total de despesas pendentes (fk_type = 2)
        $totalDespesasPendentes = $pendings->filter(function ($pending) {
            return $pending->category && $pending->category->fk_type === 2 && $pending->fk_condition === 1;
        })->sum('value_pending');

        return response()->json([
            'pendings' => $pendings,
            'total_receitas_pendentes' => $totalReceitasPendentes,
            'total_despesas_pendentes' => $totalDespesasPendentes
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'title_pending' => 'required|string|max:100',
            'initial_pending' => 'required|numeric',
            'total_pending' => 'required|numeric',
            'fk_type' => 'required|exists:types,id_type',
            'fk_category' => 'required|exists:categories,id_category',
            'fk_account' => 'required|exists:accounts,id_account',
            'fk_condition' => 'required|exists:conditions,id_condition',
            'deadline_pending' => 'nullable|date'  // Adicionei validação para deadline
        ]);

        try {
            $pendings = Pending::create($request->all());
            return response()->json($pendings, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao criar pendência: ' . $e->getMessage()], 500);
        }
    }

    public function getMonthlyPendences(Request $request)
    {
        $userId = $request->query('user_id');
        $month = $request->query('month');
        if (!$userId || !$month) {
            return response()->json(['message' => 'user_id e month são obrigatórios'], 400);
        }
        // Define start and end of month for deadline_pending filtering
        $startDate = Carbon::createFromFormat('Y-m', $month)->startOfMonth()->toDateString();
        $endDate = Carbon::createFromFormat('Y-m', $month)->endOfMonth()->toDateString();
        // Query pendings where deadline_pending is within the month (nullable deadlines excluded)
        $pendings = Pending::where('fk_account', $userId)
            ->whereNotNull('deadline_pending')
            ->whereBetween('deadline_pending', [$startDate, $endDate])
            ->with('category')
            ->get();
        return response()->json([
            'pendings' => $pendings
        ]);
    }

    public function getNearestPendencesByUser(Request $request)
    {
        $userId = $request->query('user_id');
        if (!$userId) {
            return response()->json(['message' => 'user_id é obrigatório'], 400);
        }

        // Obtém a data mais próxima com pendências cujo prazo seja igual ou maior que hoje
        $nearestDate = Pending::where('fk_account', $userId)
            ->where('fk_condition', 1) // Apenas pendências pendentes
            ->whereDate('deadline_pending', '>=', Carbon::today()) // Não considerar datas passadas
            ->orderBy('deadline_pending', 'asc')
            ->pluck('deadline_pending')
            ->first();

        if (!$nearestDate) {
            return response()->json(['pendences' => [], 'nearest_date' => null]);
        }

        $pendences = Pending::where('fk_account', $userId)
            ->whereDate('deadline_pending', $nearestDate)
            ->with('category')
            ->get();

        return response()->json([
            'nearest_date' => $nearestDate,
            'pendences' => $pendences
        ]);
    }

    public function show($id)
    {
        try {
            $pending = Pending::with('category', 'type')->findOrFail($id);
            return response()->json($pending);
        } catch (\Exception $ex) {
            return response()->json(['message' => 'Pendência não encontrada'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title_pending' => 'required|string|max:100',
            'initial_pending' => 'required|numeric',
            'total_pending' => 'required|numeric',
            'fk_type' => 'required|exists:types,id_type',
            'fk_category' => 'required|exists:categories,id_category',
            'fk_condition' => 'required|exists:conditions,id_condition',
            'deadline_pending' => 'nullable|date',
        ]);
        try {
            $pending = Pending::findOrFail($id);
            $pending->update($request->all());
            return response()->json($pending);
        } catch (\Exception $ex) {
            return response()->json(['message' => 'Erro ao atualizar pendência: ' . $ex->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $pending = Pending::findOrFail($id);
            $pending->delete();
            return response()->json(['message' => 'Pendência excluída com sucesso']);
        } catch (\Exception $ex) {
            return response()->json(['message' => 'Erro ao excluir pendência: ' . $ex->getMessage()], 500);
        }
    }
}
