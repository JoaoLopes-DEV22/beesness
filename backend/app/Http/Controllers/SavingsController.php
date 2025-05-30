<?php

namespace App\Http\Controllers;

use App\Models\Savings;
use App\Models\SavingsTransaction;
use Illuminate\Http\Request;

class SavingsController extends Controller
{

    public function updateSavingsBalance($savingsId)
    {
        try {
            // Busca a poupança com suas transações
            $savings = Savings::with('savingsTransactions')->findOrFail($savingsId);

            // Calcula as aplicações (transações tipo 1)
            $credits = $savings->savingsTransactions
                ->where('fk_type_savings', 1)
                ->sum('value_savings_transaction');

            // Calcula os resgates (transações tipo 2)
            $debits = $savings->savingsTransactions
                ->where('fk_type_savings', 2)
                ->sum('value_savings_transaction');

            // Calcula o saldo (aplicações - resgates)
            $balance = $credits - $debits;

            // Atualiza o saldo na poupança
            $savings->update([
                'balance_savings' => $balance
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Saldo da poupança atualizado com sucesso',
                'savings' => $savings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar saldo da poupança',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function updateSavingsBalanceByAccount($accountId)
    {
        try {
            // Busca a poupança da conta
            $savings = Savings::with('savingsTransactions')
                ->where('fk_account', $accountId)
                ->firstOrFail();

            // Reutiliza a lógica de atualização
            return $this->updateSavingsBalance($savings->id_savings);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar saldo da poupança da conta',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function getByAccount($accountId)
    {
        $savings = Savings::where('fk_account', $accountId)->firstOrFail();
        return response()->json($savings);
    }

    public function getTransactions($savingsId, Request $request)
    {
        $query = SavingsTransaction::where('fk_savings', $savingsId);

        // Ordenação
        if ($request->has('sort')) {
            $query->orderBy($request->sort, $request->order ?? 'asc');
        }

        // Limite
        if ($request->has('limit')) {
            $query->take($request->limit);
        }

        return response()->json($query->get());
    }

    public function createTransaction(Request $request)
    {
        try {
            $validated = $request->validate([
                'value_savings_transaction' => 'required|numeric|min:0.01',
                'fk_type_savings' => 'required|in:1,2',
                'fk_savings' => 'required|exists:savings,id_savings'
            ]);

            $transaction = SavingsTransaction::create($validated);

            // Atualiza o saldo da poupança
            $this->updateSavingsBalance($validated['fk_savings']);

            return response()->json([
                'success' => true,
                'message' => 'Transação criada com sucesso',
                'transaction' => $transaction
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar transação',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
