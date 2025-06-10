<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\HiveDecoration;
use App\Models\Decoration;
use App\Models\CosmeticStatus;
use App\Models\Account;
use Illuminate\Validation\Rule;

class HiveDecorationController extends Controller
{
    /**
     * Compra uma nova decoração para a colmeia.
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function purchaseDecoration(Request $request)
    {
        $request->validate([
            'fk_decoration' => 'required|exists:decorations,id_decoration',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['status' => false, 'message' => 'Usuário não autenticado.'], 401);
        }

        $account = $user->account;
        if (!$account) {
            return response()->json(['status' => false, 'message' => 'Conta do usuário não encontrada.'], 404);
        }

        $decoration = Decoration::find($request->fk_decoration);
        if (!$decoration) {
            return response()->json(['status' => false, 'message' => 'Decoração não encontrada.'], 404);
        }

        // Verifica se a decoração já foi comprada pelo usuário para a colmeia
        $alreadyOwned = HiveDecoration::where('fk_account', $account->id_account)
                                      ->where('fk_decoration', $decoration->id_decoration)
                                      ->exists();

        if ($alreadyOwned) {
            return response()->json(['status' => false, 'message' => 'Você já possui esta decoração para a colmeia.'], 400);
        }

        // Lógica de custo e dedução de girassóis (adapte conforme seu modelo de `Account`)
        if ($account->sunflowers_account < $decoration->price_decoration) {
            return response()->json(['status' => false, 'message' => 'Girassóis insuficientes para comprar esta decoração.'], 400);
        }

        $account->sunflowers_account -= $decoration->price_decoration;
        $account->save();

        $unequippedStatusId = 2; // ID para 'unequipped' (verifique se 2 é o ID correto no seu DB)

        // Cria o registro de posse da decoração para a colmeia
        $hiveDecoration = HiveDecoration::create([
            'position_hive_decoration' => 'none', // Começa como desequipado
            'fk_cosmetic_status' => $unequippedStatusId,
            'fk_decoration' => $decoration->id_decoration,
            'fk_account' => $account->id_account,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Decoração comprada com sucesso!',
            'data' => $hiveDecoration->load('decoration', 'cosmeticStatus')
        ]);
    }

    /**
     * Equipa uma decoração na colmeia em um slot específico (left/right).
     * @param Request $request
     * @param HiveDecoration $hiveDecoration (Model Binding)
     * @param string $positionSlot O slot (e.g., 'left', 'right') da rota
     * @return \Illuminate\Http\JsonResponse
     */
    public function equipDecoration(Request $request, HiveDecoration $hiveDecoration, string $positionSlot)
    {
        // Validação do positionSlot vindo da rota
        if (!in_array($positionSlot, ['left', 'right'])) {
            return response()->json(['status' => false, 'message' => 'Posição de slot inválida.'], 400);
        }

        $user = Auth::user();
        $account = $user->account;

        // Verifica se a decoração pertence ao usuário autenticado
        if ($hiveDecoration->fk_account !== $account->id_account) {
            return response()->json(['status' => false, 'message' => 'Você não possui esta decoração.'], 403);
        }

        $equippedStatusId = 1; // ID para 'equipped' (verifique se 1 é o ID correto no seu DB)
        $unequippedStatusId = 2; // ID para 'unequipped' (verifique se 2 é o ID correto no seu DB)

        // Desequipa qualquer outra decoração que esteja no mesmo slot
        $existingEquippedDecoration = HiveDecoration::where('fk_account', $account->id_account)
                                                    ->where('position_hive_decoration', $positionSlot)
                                                    ->where('fk_cosmetic_status', $equippedStatusId)
                                                    ->first();

        if ($existingEquippedDecoration && $existingEquippedDecoration->id_hive_decoration !== $hiveDecoration->id_hive_decoration) {
            $existingEquippedDecoration->update([
                'position_hive_decoration' => 'none',
                'fk_cosmetic_status' => $unequippedStatusId,
            ]);
        }

        // Equipa a nova decoração
        $hiveDecoration->update([
            'position_hive_decoration' => $positionSlot,
            'fk_cosmetic_status' => $equippedStatusId,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Decoração equipada com sucesso!',
            'data' => $hiveDecoration->load('decoration', 'cosmeticStatus')
        ]);
    }

    /**
     * Desequipa uma decoração da colmeia.
     * @param HiveDecoration $hiveDecoration (Model Binding)
     * @param string $positionSlot O slot (e.g., 'left', 'right') de onde a decoração *estava* equipada, vindo da rota.
     * @return \Illuminate\Http\JsonResponse
     */
    public function unequipDecoration(HiveDecoration $hiveDecoration, string $positionSlot)
    {
        // Validação do positionSlot vindo da rota
        if (!in_array($positionSlot, ['left', 'right'])) {
            return response()->json(['status' => false, 'message' => 'Posição de slot inválida.'], 400);
        }

        $user = Auth::user();
        $account = $user->account;

        // Verifica se a decoração pertence ao usuário autenticado
        if ($hiveDecoration->fk_account !== $account->id_account) {
            return response()->json(['status' => false, 'message' => 'Você não possui esta decoração.'], 403);
        }

        $unequippedStatusId = 2; // ID para 'unequipped'
        $equippedStatusId = 1; // ID para 'equipped'

        // Verifica se a decoração está realmente equipada no slot que se está tentando desequipar
        if ($hiveDecoration->fk_cosmetic_status !== $equippedStatusId || $hiveDecoration->position_hive_decoration !== $positionSlot) {
            return response()->json(['status' => false, 'message' => 'Esta decoração não está equipada neste slot.'], 400);
        }

        // Desequipa a decoração
        $hiveDecoration->update([
            'position_hive_decoration' => 'none',
            'fk_cosmetic_status' => $unequippedStatusId,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Decoração desequipada com sucesso!',
            'data' => $hiveDecoration->load('decoration', 'cosmeticStatus')
        ]);
    }

    /**
     * Get all hive decorations owned by the authenticated user.
     * Includes equipped and unequipped items.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserHiveDecorations()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Usuário não autenticado.'
            ], 401);
        }

        $userAccount = $user->account;

        if (!$userAccount) {
            return response()->json([
                'status' => false,
                'message' => 'Dados da conta da abelha não encontrados.'
            ], 404);
        }

        // Busca todas as HiveDecorations do usuário, carregando os dados da Decoration e CosmeticStatus
        $hiveDecorations = HiveDecoration::where('fk_account', $userAccount->id_account)
                                         ->with(['decoration', 'cosmeticStatus'])
                                         ->get();

        return response()->json([
            'status' => true,
            'data' => $hiveDecorations
        ]);
    }
}