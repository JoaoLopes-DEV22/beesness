<?php

namespace App\Http\Controllers;

use App\Models\Bee;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\BeeAccessory;
use App\Models\Accessory;

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

        return response()->json([
            'status' => true,
            'data' => [
                'bee_data' => $bee,
                'sunflowers' => (string)$account->sunflowers_account,
                'owned_accessories' => $ownedAccessories,
                'equipped_accessories_display' => $equippedAccessoriesDisplay,
            ]
        ], 200);
    }
}