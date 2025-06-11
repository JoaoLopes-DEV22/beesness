<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transaction;
use App\Models\Savings;
use App\Models\SavingsTransaction;
use Illuminate\Http\Request;

class AccountController extends Controller
{

    public function getAccountByUserId($userId)
    {
        $account = Account::where('fk_user', $userId)->first();

        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'Conta não encontrada para este usuário'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'id_account' => $account->id_account,
            'account' => $account
        ]);
    }


    public function updateAccountValues($accountId)
    {
        try {
            // Carrega a conta com todos os relacionamentos necessários
            $account = Account::with([
                'transactions',
                'savings.savingsTransactions',
                'pendings.transactions'
            ])->findOrFail($accountId);

            // 1. Calcula receitas e despesas das transações normais
            $incomes = $account->transactions
                ->where('fk_type', 1) // Tipo 1 = Receita
                ->sum('value_transaction');

            $expenses = $account->transactions
                ->where('fk_type', 2) // Tipo 2 = Despesa
                ->sum('value_transaction');

            $balance = $incomes - $expenses;

            // 2. Ajusta o saldo com transações de poupança, se existir
            if ($account->savings) {
                $savingsDebits = $account->savings->savingsTransactions
                    ->where('fk_type_savings', 1) // 1 = Aplicação (diminui saldo)
                    ->sum('value_savings_transaction');

                $savingsCredits = $account->savings->savingsTransactions
                    ->where('fk_type_savings', 2) // 2 = Resgate (aumenta saldo)
                    ->sum('value_savings_transaction');

                $balance = $balance - $savingsDebits + $savingsCredits;
            }

            // 3. Ajusta o saldo com transações de pendências
            foreach ($account->pendings as $pending) {
                $pendingDebits = $pending->transactions
                    ->where('fk_type_savings', 1) // 1 = Aplicação
                    ->sum('value_pending_transaction');

                $pendingCredits = $pending->transactions
                    ->where('fk_type_savings', 2) // 2 = Resgate
                    ->sum('value_pending_transaction');

                // Se for uma pendência de receita (fk_type = 1):
                // - Aplicações aumentam o saldo (valor entra na conta)
                // - Resgates diminuem o saldo (valor sai da conta)
                if ($pending->fk_type === 1) {
                    $balance = $balance + $pendingDebits - $pendingCredits;
                }
                // Se for uma pendência de despesa (fk_type = 2):
                // - Aplicações diminuem o saldo (valor reservado para pagamento)
                // - Resgates aumentam o saldo (valor liberado de volta para conta)
                else {
                    $balance = $balance - $pendingDebits + $pendingCredits;
                }
            }

            // 4. Atualiza os valores da conta
            $account->update([
                'incomes_account' => $incomes,
                'expenses_account' => $expenses,
                'balance_account' => $balance,
            ]);

            // 5. Atualiza o saldo da poupança relacionada (se existir)
            if ($account->savings) {
                app(SavingsController::class)->updateSavingsBalanceByAccount($accountId);
            }

            return response()->json([
                'success' => true,
                'message' => 'Valores atualizados com sucesso',
                'account' => [
                    'id' => $account->id_account,
                    'balance' => $balance,
                    'incomes' => $incomes,
                    'expenses' => $expenses
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar valores da conta',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function getAccountValues($accountId)
    {
        $account = Account::findOrFail($accountId);

        return response()->json([
            'success' => true,
            'account' => $account
        ]);
    }
}
