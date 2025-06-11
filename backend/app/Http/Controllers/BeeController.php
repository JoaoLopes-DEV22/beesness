<?php

namespace App\Http\Controllers;

use App\Models\Bee;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\BeeAccessory;
use App\Models\Accessory;
use App\Models\HiveDecoration; // Importe o modelo HiveDecoration
use Illuminate\Support\Facades\Validator; // Para validação
use Illuminate\Support\Facades\Log; // Para logs de depuração


class BeeController extends Controller
{
    /**
     * Retorna os dados da abelha do usuário autenticado, incluindo os dados da conta
     * e os acessórios que a abelha possui.
     */
    public function showBee()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['status' => false, 'message' => 'Usuário não autenticado.'], 401);
        }

        $account = $user->account;
        if (!$account) {
            return response()->json(['status' => false, 'message' => 'Conta do usuário não encontrada.'], 404);
        }

        $bee = $account->bee;
        if (!$bee) {
            return response()->json(['status' => false, 'message' => 'Abelha não encontrada para esta conta.'], 404);
        }

        // Carrega todos os acessórios que a abelha possui, com os detalhes do acessório
        $ownedAccessories = BeeAccessory::where('fk_bee', $bee->id_bee)
            ->with('accessory')
            ->get();

        // Inicializa o array para os acessórios equipados para exibição
        $equippedAccessoriesDisplay = [
            'head' => '',
            'face' => '',
            'body' => '',
        ];

        // Itera sobre os acessórios possuídos para encontrar os equipados
        foreach ($ownedAccessories as $item) {
            if ($item->fk_cosmetic_status === 1 && $item->accessory) {
                $accessoryType = $item->accessory->type_accessory;

                if (array_key_exists($accessoryType, $equippedAccessoriesDisplay)) {
                    // *** AQUI: Agora estamos pegando o caminho da imagem ***
                    $equippedAccessoriesDisplay[$accessoryType] = $item->accessory->img_accessory;
                }
            }
        }

        $ownedHiveDecorations = HiveDecoration::where('fk_account', $account->id_account)
            ->with('decoration', 'cosmeticStatus') // Carrega detalhes da Decoration e do Status
            ->get();

        $equippedHiveDecorations = HiveDecoration::where('fk_account', $account->id_account)
            ->where('fk_cosmetic_status', 1) // Filtra apenas as equipadas
            ->whereIn('position_hive_decoration', ['left', 'right']) // Garante que tem posição
            ->with('decoration', 'cosmeticStatus') // Carrega detalhes da Decoration e do Status
            ->get();

        return response()->json([
            'status' => true,
            'data' => [
                'bee_data' => $bee,
                'sunflowers' => (string)$account->sunflowers_account,
                'owned_accessories' => $ownedAccessories,
                'equipped_accessories_display' => $equippedAccessoriesDisplay,
                'owned_hive_decorations' => $ownedHiveDecorations,
                'equipped_hive_decorations' => $equippedHiveDecorations,
            ]
        ], 200);
    }

public function rename(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Usuário não autenticado.'], 401);
        }

        $account = $user->account;

        if (!$account) {
            return response()->json(['message' => 'Conta associada ao usuário não encontrada.'], 404);
        }

        $bee = $account->bee; // Pega a abelha da conta
        
        if (!$bee) {
            return response()->json(['message' => 'Abelha associada à conta não encontrada.'], 404);
        }

        // 1. Validação do novo nome
        $validator = Validator::make($request->all(), [
            'new_name' => 'required|string|max:50|min:1', // Novo nome é obrigatório, string, max 50 chars, min 1 char
        ], [
            'new_name.required' => 'O novo nome da abelha é obrigatório.',
            'new_name.string' => 'O nome da abelha deve ser um texto.',
            'new_name.max' => 'O nome da abelha não pode ter mais de :max caracteres.',
            'new_name.min' => 'O nome da abelha deve ter pelo menos :min caractere.',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erro de validação.', 'errors' => $validator->errors()], 422);
        }

        $newName = $request->input('new_name');

        // 2. Trocar o nome antigo caso não seja vazio
        // A validação 'min:1' já garante que $newName não será vazio
        // Mas se você quiser um tratamento extra aqui, pode adicionar
        
        $oldName = $bee->name_bee; // Guarda o nome antigo para a resposta

        $bee->name_bee = $newName;
        
        if ($bee->isDirty('name_bee')) { // Verifica se o nome realmente mudou
            $bee->save();
            Log::info("Abelha {$oldName} renomeada para {$newName} pela conta {$account->id_account}.");
            return response()->json([
                'message' => 'Nome da abelha atualizado com sucesso!',
                'old_name' => $oldName,
                'new_name' => $bee->name_bee,
                'status' => true
            ]);
        } else {
            return response()->json(['message' => 'O nome da abelha já é o mesmo.', 'status' => false]);
        }
    }
}
