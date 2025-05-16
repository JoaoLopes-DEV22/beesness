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
}

