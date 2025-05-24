<?php

namespace App\Http\Controllers;

use App\Models\Bee;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\BeeAccessory; // Importe o Model BeeAccessory

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

     
        $ownedAccessories = BeeAccessory::where('fk_bee', $bee->id_bee)
                                        ->with('accessory') // Carrega os detalhes do acessório relacionado
                                        ->get();

        return response()->json([
            'status' => true,
            'data' => [
                'bee_data' => $bee,
                'sunflowers' => $account->sunflowers_account,
                'owned_accessories' => $ownedAccessories, // Adiciona os acessórios possuídos aqui
            ]
        ], 200);
    }
}