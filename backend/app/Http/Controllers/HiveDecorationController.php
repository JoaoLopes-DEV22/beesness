<?php

namespace App\Http\Controllers;

use App\Models\Decoration; // Para buscar os detalhes da decoração a ser comprada
use App\Models\HiveDecoration; // O modelo que representa a decoração na colmeia do usuário
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Account; // Assumindo que a conta do usuário é o modelo para girassóis e nível

class HiveDecorationController extends Controller
{
    /**
     * Handles the purchase of a decoration for the user's hive.
     * Creates a new HiveDecoration entry with 'none' position and 'unequipped' status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function purchaseDecoration(Request $request)
    {
        // 1. Validação da requisição
        $request->validate([
            'fk_decoration' => 'required|integer|exists:decorations,id_decoration',
        ]);

        $decorationId = $request->fk_decoration;
        $userAccount = Auth::user(); // Assumindo que Auth::user() retorna sua instância de Account ou um modelo que possui 'id_account', 'sunflowers', 'level_bee'

        // Se o usuário não estiver autenticado, retorne um erro
        if (!$userAccount) {
            return response()->json([
                'status' => false,
                'message' => 'Usuário não autenticado.'
            ], 401); // Unauthorized
        }

        // Encontre a decoração que o usuário quer comprar
        $decoration = Decoration::find($decorationId);

        if (!$decoration) {
            return response()->json([
                'status' => false,
                'message' => 'Decoração não encontrada.'
            ], 404); // Not Found
        }

        // 2. Verificações de Elegibilidade (Preço e Nível)
        if ($userAccount->account->sunflowers_account < $decoration->price_decoration) {
            return response()->json([
                'status' => false,
                'message' => 'Girassóis insuficientes para comprar esta decoração.',
            ], 400); // Bad Request
        }

        if ($userAccount->account->bee->level_bee < $decoration->level_decoration) {
            return response()->json([
                'status' => false,
                'message' => 'Nível insuficiente para comprar esta decoração. Nível necessário: ' . $decoration->level_decoration
            ], 400); // Bad Request
        }

        // 3. Verificar se o usuário já possui esta decoração em seu inventário de colmeia
        $alreadyOwned = HiveDecoration::where('fk_account', $userAccount->id_account)
            ->where('fk_decoration', $decorationId)
            ->exists();

        if ($alreadyOwned) {
            return response()->json([
                'status' => false,
                'message' => 'Você já possui esta decoração.'
            ], 409); // Conflict
        }

        // 4. Iniciar uma transação de banco de dados
        DB::beginTransaction();

        try {
            // 5. Criar o registro em hive_decorations
            // Assumindo que '2' é o ID para 'unequipped' na sua tabela 'cosmetic_status'

            $hiveDecoration = HiveDecoration::create([
                'position_hive_decoration' => 'none',
                'fk_cosmetic_status' => 2, // ID para "desequipado"
                'fk_decoration' => $decorationId,
                'fk_account' => $userAccount->account->id_account,
            ]);

            // 6. Deduzir os girassóis do usuário E SALVAR NA CONTA DA ABELHA (Account)
            $userAccount->account->sunflowers_account -= $decoration->price_decoration;
            $userAccount->save(); // <-- Salva o modelo Account (que foi modificado)

            // 7. Confirmar a transação
            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Decoração comprada com sucesso e adicionada ao seu inventário!',
                'data' => $hiveDecoration
            ], 201); // Created

        } catch (\Exception $e) {
            // 8. Reverter a transação em caso de erro
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Erro ao processar a compra da decoração. Tente novamente.'. $e,
                
            ], 500); // Internal Server Error
        }
    }

    /**
     * Equips a specific hive decoration to a given slot.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\HiveDecoration  $hiveDecoration The specific hive decoration to be equipped.
     * @return \Illuminate\Http\JsonResponse
     */
    public function equipDecoration(Request $request, HiveDecoration $hiveDecoration)
    {
        // 1. Validação da requisição
        $request->validate([
            'position_slot' => 'required|in:left,right', // Assegura que a posição é 'left' ou 'right'
        ]);

        $slot = $request->position_slot;
        $userAccount = Auth::user();

        // 2. Verificar se a hiveDecoration pertence ao usuário logado
        if ($hiveDecoration->fk_account !== $userAccount->id_account) {
            return response()->json([
                'status' => false,
                'message' => 'Você não tem permissão para equipar esta decoração.'
            ], 403); // Forbidden
        }

        DB::beginTransaction();
        try {
            // 3. Desequipar qualquer decoração que já esteja no slot desejado
            // Assumindo que só pode haver 1 decoração por slot (left/right)
            $existingDecorationInSlot = HiveDecoration::where('fk_account', $userAccount->id_account)
                ->where('position_hive_decoration', $slot)
                ->first();

            if ($existingDecorationInSlot) {
                $existingDecorationInSlot->update([
                    'position_hive_decoration' => 'none', // Mova para 'none'
                    'fk_cosmetic_status' => 2, // Setar como unequipped
                ]);
            }

            // 4. Equipar a decoração atual no novo slot
            // Assumindo que '1' é o ID para 'equipped' na sua tabela 'cosmetic_status'
            $hiveDecoration->update([
                'position_hive_decoration' => $slot,
                'fk_cosmetic_status' => 1, // Setar como equipped
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Decoração equipada com sucesso!',
                'equipped_decoration' => $hiveDecoration->load('decoration') // Carrega os detalhes da decoração para o retorno
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Erro ao equipar decoração. Tente novamente.'
            ], 500);
        }
    }

    /**
     * Unequips a specific hive decoration.
     *
     * @param  \App\Models\HiveDecoration  $hiveDecoration The specific hive decoration to be unequipped.
     * @return \Illuminate\Http\JsonResponse
     */
    public function unequipDecoration(HiveDecoration $hiveDecoration)
    {
        $userAccount = Auth::user();

        // Verificar se a hiveDecoration pertence ao usuário logado
        if ($hiveDecoration->fk_account !== $userAccount->id_account) {
            return response()->json([
                'status' => false,
                'message' => 'Você não tem permissão para desequipar esta decoração.'
            ], 403); // Forbidden
        }

        DB::beginTransaction();
        try {
            // Assumindo que '2' é o ID para 'unequipped' na sua tabela 'cosmetic_status'
            $hiveDecoration->update([
                'position_hive_decoration' => 'none', // Mova para 'none'
                'fk_cosmetic_status' => 2, // Setar como unequipped
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Decoração desequipada com sucesso e movida para o inventário!'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Erro ao desequipar decoração. Tente novamente.'
            ], 500);
        }
    }

    // Você pode adicionar aqui outros métodos relacionados a HiveDecorations, como:
    // - public function getEquippedDecorations() (para a tela da colmeia)
    // - public function getInventoryDecorations() (para o modal de inventário)
    // - public function removeDecoration($id) (para remover definitivamente do inventário, se permitido)
}
