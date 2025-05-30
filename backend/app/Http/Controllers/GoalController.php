<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Models\GoalTransaction; // Certifique-se de que o modelo GoalTransaction está importado
use Illuminate\Http\Request;

class GoalController extends Controller
{

    public function index(Request $request)
    {
        $request->validate([
            'accountId' => 'required|exists:accounts,id_account',
            'page' => 'sometimes|integer|min:1',
            'perPage' => 'sometimes|integer|min:1|max:20',
            'condition' => 'sometimes|in:1,2', // Adicione a validação para o filtro de condição (status)
            'order' => 'sometimes|in:asc,desc' // Adicione a validação para a ordem do prazo
        ]);

        $perPage = $request->perPage ?? 4;
        $accountId = $request->accountId;
        $conditionFilter = $request->condition;
        $deadlineOrder = $request->order;

        $query = Goal::where('fk_account', $accountId);

        // Aplica o filtro de condição (status) se ele estiver presente
        if ($conditionFilter) {
            $query->where('fk_condition', $conditionFilter);
        }

        // Aplica a ordenação por prazo se ela estiver presente
        if ($deadlineOrder) {
            $query->orderBy('deadline_goal', $deadlineOrder);
        } else {
            // Ordenação padrão se nenhum filtro de ordem for aplicado
            $query->orderBy('created_at', 'desc');
        }

        $goals = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'goals' => $goals->items(),
            'totalPages' => $goals->lastPage(),
            'currentPage' => $goals->currentPage()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_goal' => 'required|string|max:255',
            'target_goal' => 'required|numeric|min:0.01',
            'deadline_goal' => 'nullable|date',
            'value_goal' => 'sometimes|numeric|min:0',
            'fk_condition' => 'sometimes|integer|exists:conditions,id_condition',
            'fk_account' => 'required|exists:accounts,id_account'
        ]);

        // Define valores padrão
        $validated['value_goal'] = $validated['value_goal'] ?? 0;
        $validated['fk_condition'] = $validated['fk_condition'] ?? 1; // 1 = Pendente

        $goal = Goal::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Meta criada com sucesso',
            'goal' => $goal
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title_goal' => 'sometimes|string|max:255',
            'target_goal' => 'sometimes|numeric|min:0.01',
            'deadline_goal' => 'nullable|date',
            'fk_condition' => 'sometimes|integer|exists:conditions,id_condition'
        ]);

        $goal = Goal::findOrFail($id);
        $goal->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Meta atualizada com sucesso',
            'goal' => $goal
        ]);
    }

    public function updateGoalValue($id)
    {
        $goal = Goal::with('transactions')->findOrFail($id);

        $credits = $goal->transactions
            ->where('fk_type_savings', 1)
            ->sum('value_goal_transaction');

        $debits = $goal->transactions
            ->where('fk_type_savings', 2)
            ->sum('value_goal_transaction');

        $calculatedValue = $credits - $debits;

        // Limita o valor ao target_goal (não ultrapassa)
        if ($calculatedValue > $goal->target_goal) {
            $calculatedValue = $goal->target_goal;
        }
        if ($calculatedValue < 0) {
            $calculatedValue = 0;
        }

        // Atualiza value_goal
        $goal->value_goal = $calculatedValue;

        // Atualiza fk_condition: 2 se atingiu target_goal, senão 1
        if ($calculatedValue >= $goal->target_goal && $goal->target_goal > 0) {
            $goal->fk_condition = 2; // Concluído
        } else {
            $goal->fk_condition = 1; // Pendente
        }

        $goal->save();

        return response()->json([
            'success' => true,
            'message' => 'Valor da meta atualizado e condição ajustada',
            'goal' => $goal
        ]);
    }

    public function show($id)
    {
        $goal = Goal::with('transactions')->findOrFail($id);
        return response()->json([
            'success' => true,
            'goal' => $goal
        ]);
    }

    public function destroy($id)
    {
        try {
            $goal = Goal::findOrFail($id);
            $goal->delete();

            return response()->json([
                'success' => true,
                'message' => 'Meta excluída com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao excluir meta',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Método para registrar transações
    public function storeTransaction(Request $request)
    {
        $validated = $request->validate([
            'value_goal_transaction' => 'required|numeric|min:0.01',
            'fk_type_savings' => 'required|integer|in:1,2', // 1=aplicar, 2=resgatar
            'fk_goal' => 'required|exists:goals,id_goal',
        ]);

        $goal = Goal::with('transactions')->findOrFail($validated['fk_goal']);

        $transactionValue = $validated['value_goal_transaction'];
        $type = $validated['fk_type_savings'];

        // Calcula total de créditos e débitos atuais
        $credits = $goal->transactions
            ->where('fk_type_savings', 1)
            ->sum('value_goal_transaction');

        $debits = $goal->transactions
            ->where('fk_type_savings', 2)
            ->sum('value_goal_transaction');

        $currentValue = $credits - $debits;

        if ($type === 1) {
            // Aplicar: não pode ultrapassar target_goal
            $availableSpace = $goal->target_goal - $currentValue;
            if ($availableSpace <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Meta já atingiu o valor alvo. Não é possível aplicar mais valores.'
                ], 400);
            }

            // Ajusta o valor da transação para não ultrapassar o target
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
        $goalTransaction = GoalTransaction::create([
            'value_goal_transaction' => $transactionValue,
            'fk_type_savings' => $type,
            'fk_goal' => $goal->id_goal,
        ]);

        // Atualiza o valor e condição da meta após a transação
        $this->updateGoalValue($goal->id_goal);

        return response()->json([
            'success' => true,
            'message' => 'Transação registrada com sucesso',
            'transaction' => $goalTransaction,
        ]);
    }
}
