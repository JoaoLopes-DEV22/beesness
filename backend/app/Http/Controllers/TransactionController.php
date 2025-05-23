<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title_transaction' => 'required|string|max:100',
            'value_transaction' => 'required|numeric',
            'fk_type' => 'required|exists:types,id_type',
            'fk_category' => 'required|exists:categories,id_category',
            'fk_account' => 'required|exists:accounts,id_account'
        ]);

        try {
            $transaction = Transaction::create($request->all());
            return response()->json($transaction, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao criar transação: ' . $e->getMessage()], 500);
        }
    }

    // Novo método para trazer as transações do último dia para o usuário especificado via query param
    public function getLastTransactionsByUser(Request $request)
    {
        $userId = $request->query('user_id');
        if (!$userId) {
            return response()->json(['message' => 'user_id é obrigatório'], 400);
        }

        $lastTransaction = Transaction::where('fk_account', $userId)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$lastTransaction) {
            // Nenhuma transação para esse usuário
            return response()->json(['transactions' => [], 'last_date' => null]);
        }

        $lastDate = $lastTransaction->created_at->toDateString();

        $transactions = Transaction::where('fk_account', $userId)
            ->whereDate('created_at', $lastDate)
            ->with('category')  // Certifique-se que esse relacionamento existe no Model Transaction
            ->get();

        return response()->json([
            'last_date' => $lastDate,
            'transactions' => $transactions
        ]);
    }

    public function getMonthlyTransactions(Request $request)
    {
        $userId = $request->query('user_id');
        $month = $request->query('month');

        if (!$userId || !$month) {
            return response()->json(['message' => 'user_id e month são obrigatórios'], 400);
        }

        // Obtém o primeiro e último dia do mês selecionado
        $startDate = \Carbon\Carbon::createFromFormat('Y-m', $month)->startOfMonth();
        $endDate = \Carbon\Carbon::createFromFormat('Y-m', $month)->endOfMonth();

        // Busca as transações do usuário no mês selecionado
        $transactions = Transaction::where('fk_account', $userId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        return response()->json(['transactions' => $transactions]);
    }

    public function getMonthlyTransactionsByType(Request $request)
    {
        $userId = $request->query('user_id');
        $month = $request->query('month');
        $type = $request->query('type');

        if (!$userId || !$month) {
            return response()->json(['message' => 'user_id e month são obrigatórios'], 400);
        }

        $startDate = \Carbon\Carbon::createFromFormat('Y-m', $month)->startOfMonth();
        $endDate = \Carbon\Carbon::createFromFormat('Y-m', $month)->endOfMonth();

        $query = Transaction::where('fk_account', $userId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->with('category');

        if ($type) {
            $query->where('fk_type', $type);
        }

        $transactions = $query->get()->map(function ($transaction) {
            // Certifique-se de que value_transaction é um número
            $transaction->value_transaction = (float) $transaction->value_transaction;
            return $transaction;
        });

        return response()->json(['transactions' => $transactions]);
    }

    public function show($id)
    {
        try {
            $transaction = Transaction::with('category', 'type')->findOrFail($id);
            return response()->json($transaction);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Transação não encontrada'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title_transaction' => 'required|string|max:100',
            'value_transaction' => 'required|numeric',
            'fk_type' => 'required|exists:types,id_type',
            'fk_category' => 'required|exists:categories,id_category',
        ]);

        try {
            $transaction = Transaction::findOrFail($id);
            $transaction->update($request->all());
            return response()->json($transaction);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao atualizar transação: ' . $e->getMessage()], 500);
        }
    }

    // TransactionController.php

    public function destroy($id)
    {
        try {
            $transaction = Transaction::findOrFail($id);
            $transaction->delete();
            return response()->json(['message' => 'Transação excluída com sucesso']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao excluir transação: ' . $e->getMessage()], 500);
        }
    }
}
