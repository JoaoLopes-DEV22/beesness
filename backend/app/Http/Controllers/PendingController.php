<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Pending;
use App\Models\PendingTransaction;
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

    $result = Pending::where('pendings.fk_account', $userId) // Especifica a tabela
        ->where('pendings.fk_condition', 1) // Especifica a tabela
        ->whereBetween('pendings.created_at', [$startDate, $endDate]) // Especifica a tabela
        ->join('categories', 'pendings.fk_category', '=', 'categories.id_category')
        ->selectRaw('SUM(CASE WHEN categories.fk_type = 1 THEN pendings.initial_pending ELSE 0 END) AS total_receitas_pendentes')
        ->selectRaw('SUM(CASE WHEN categories.fk_type = 2 THEN pendings.initial_pending ELSE 0 END) AS total_despesas_pendentes')
        ->first();

    // Obter também a lista de pendências para retornar
    $pendings = Pending::where('fk_account', $userId)
        ->whereBetween('created_at', [$startDate, $endDate])
        ->with('category')
        ->get();

    return response()->json([
        'pendings' => $pendings,
        'total_receitas_pendentes' => $result->total_receitas_pendentes ?? 0,
        'total_despesas_pendentes' => $result->total_despesas_pendentes ?? 0
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
            'total_pending' => 'required|numeric',
            'fk_type' => 'required|exists:types,id_type',
            'fk_category' => 'required|exists:categories,id_category',
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

    

    public function storeTransaction(Request $request)
    {
        $validated = $request->validate([
            'value_pending_transaction' => 'required|numeric|min:0.01',
            'fk_type_savings' => 'required|integer|in:1,2', // 1=aplicar, 2=resgatar
            'fk_pending' => 'required|exists:pendings,id_pending',
        ]);

        $pending = Pending::with('transactions')->findOrFail($validated['fk_pending']);

        $transactionValue = $validated['value_pending_transaction'];
        $type = $validated['fk_type_savings'];

        // Calcula total de créditos e débitos atuais
        $credits = $pending->transactions
            ->where('fk_type_savings', 1)
            ->sum('value_pending_transaction');

        $debits = $pending->transactions
            ->where('fk_type_savings', 2)
            ->sum('value_pending_transaction');

        $currentValue = $credits - $debits;

        if ($type === 1) {
            // Aplicar: não pode ultrapassar total_pending
            $availableSpace = $pending->total_pending - $currentValue;
            if ($availableSpace <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pendência já atingiu o valor total. Não é possível aplicar mais valores.'
                ], 400);
            }

            // Ajusta o valor da transação para não ultrapassar o total
            if ($transactionValue > $availableSpace) {
                $transactionValue = $availableSpace;
            }
        } else {
            // Resgatar: não pode resgatar mais do que o valor atual
            if ($transactionValue > $currentValue) {
                $transactionValue = $currentValue;
                if ($transactionValue <= 0) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Não há saldo suficiente para resgatar.'
                    ], 400);
                }
            }
        }

        // Cria a transação
        $pendingTransaction = PendingTransaction::create([
            'value_pending_transaction' => $transactionValue,
            'fk_type_savings' => $type,
            'fk_pending' => $pending->id_pending,
        ]);

        // Atualiza o valor inicial da pendência
        $this->updatePendingValue($pending->id_pending);

        return response()->json([
            'success' => true,
            'message' => 'Transação registrada com sucesso',
            'transaction' => $pendingTransaction,
        ]);
    }

    /**
     * Atualiza o valor e status da pendência
     */
    public function updatePendingValue($id)
    {
        $pending = Pending::with('transactions')->findOrFail($id);

        $credits = $pending->transactions
            ->where('fk_type_savings', 1)
            ->sum('value_pending_transaction');

        $debits = $pending->transactions
            ->where('fk_type_savings', 2)
            ->sum('value_pending_transaction');

        $calculatedValue = $credits - $debits;

        // Limita o valor ao total_pending (não ultrapassa)
        if ($calculatedValue > $pending->total_pending) {
            $calculatedValue = $pending->total_pending;
        }
        if ($calculatedValue < 0) {
            $calculatedValue = 0;
        }

        // Atualiza initial_pending
        $pending->initial_pending = $calculatedValue;

        // Atualiza fk_condition: 2 se atingiu total_pending, senão 1
        if ($calculatedValue >= $pending->total_pending && $pending->total_pending > 0) {
            $pending->fk_condition = 2; // Concluído
        } else {
            $pending->fk_condition = 1; // Pendente
        }

        $pending->save();

        // Atualiza o saldo da conta
        app(AccountController::class)->updateAccountValues($pending->fk_account);

        return response()->json([
            'success' => true,
            'message' => 'Valor da pendência atualizado e condição ajustada',
            'pending' => $pending
        ]);
    }
}
