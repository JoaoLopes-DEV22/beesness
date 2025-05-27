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
}