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

        $account = Account::with(['transactions', 'savings.savingsTransactions'])
            ->findOrFail($accountId);

        // Calcula receitas (transações com type = 1)
        $incomes = $account->transactions
            ->where('fk_type', 1)
            ->sum('value_transaction');

        // Calcula despesas (transações com type = 2)
        $expenses = $account->transactions
            ->where('fk_type', 2)
            ->sum('value_transaction');

        $balance = $incomes - $expenses;

        // Ajusta o saldo com transações de poupança se existirem
        if ($account->savings) {
            $savingsDebits = $account->savings->savingsTransactions
                ->where('fk_type_savings', 1)
                ->sum('value_savings_transaction');

            $savingsCredits = $account->savings->savingsTransactions
                ->where('fk_type_savings', 2)
                ->sum('value_savings_transaction');

            $balance = $balance - $savingsDebits + $savingsCredits;
        }

        $account->update([
            'incomes_account' => $incomes,
            'expenses_account' => $expenses,
            'balance_account' => $balance,
        ]);

        // Atualiza Saldo da Poupança relacionada com a Conta
        app(SavingsController::class)->updateSavingsBalanceByAccount($accountId);

        return response()->json([
            'success' => true,
            'message' => 'Valores atualizados com sucesso',
            'account' => $account
        ]);
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
