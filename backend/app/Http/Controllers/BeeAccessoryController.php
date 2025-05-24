<?php

namespace App\Http\Controllers;

use App\Models\BeeAccessory; // Importe o Model BeeAccessory
use App\Models\CosmeticStatus; // Importe o Model CosmeticStatus para buscar o status
use App\Models\Bee; // Importe o Model Bee para verificar a abelha
use App\Models\Accessory; // Importe o Model Accessory para verificar o acessório

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Para obter o usuário autenticado
use Illuminate\Support\Facades\DB; // Opcional, para transações

class BeeAccessoryController extends Controller
{
    /**
     * Insere um novo acessório para a abelha do usuário autenticado.
     * Isso simula a ação de "comprar" um acessório.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // 1. Validação da Requisição
        // Certifique-se de que o request contém o 'fk_accessory'
        $request->validate([
            'fk_accessory' => 'required|integer|exists:accessories,id_accessory', // Garante que o acessório exista
        ]);

        // 2. Obter o Usuário, Abelha e Acessório
        $user = Auth::user();

        // Verifica se o usuário está autenticado
        if (!$user) {
            return response()->json(['status' => false, 'message' => 'Usuário não autenticado.'], 401);
        }

        // Obtém a abelha associada à conta do usuário
        // Assumimos que o relacionamento User->Account->Bee está configurado corretamente
        $bee = $user->account->bee;
        if (!$bee) {
            return response()->json(['status' => false, 'message' => 'Abelha não encontrada para este usuário.'], 404);
        }

        // Obtém o acessório que está sendo comprado
        $accessory = Accessory::find($request->fk_accessory);
        if (!$accessory) {
            return response()->json(['status' => false, 'message' => 'Acessório não encontrado.'], 404);
        }

        // 3. Verificação de Nível (Regra de Negócio)
        if ($bee->level_bee < $accessory->level_accessory) {
            return response()->json([
                'status' => false,
                'message' => 'Nível da abelha insuficiente para comprar este acessório. Requer nível ' . $accessory->level_accessory . '.'
            ], 403); // 403 Forbidden
        }

        // 4. Verificação de Girassóis (Regra de Negócio)
        // Assumimos que a conta tem os girassóis e eles serão gastos
        $account = $user->account;
        if ($account->sunflowers_account < $accessory->price_accessory) {
            return response()->json([
                'status' => false,
                'message' => 'Girassóis insuficientes para comprar este acessório.'
            ], 400); // 400 Bad Request
        }

        // 5. Verificar se a abelha já possui o acessório (Opcional, mas comum)
        $existingBeeAccessory = BeeAccessory::where('fk_bee', $bee->id_bee)
                                            ->where('fk_accessory', $accessory->id_accessory)
                                            ->first();
        if ($existingBeeAccessory) {
            return response()->json(['status' => false, 'message' => 'A abelha já possui este acessório.'], 409); // 409 Conflict
        }

        // 6. Obter o ID do status 'unequipped' (ou 'No Inventário')
        // Assumimos que você tem um status com 'type_cosmetic_status' = 'unequipped' no seu seeder
        $unequippedStatus = CosmeticStatus::where('type_cosmetic_status', 'unequipped')->first();

        if (!$unequippedStatus) {
            return response()->json(['status' => false, 'message' => 'Status "unequipped" não encontrado no sistema.'], 500); // Erro de servidor
        }

        // 7. Inserir o registro na tabela bee_accessories (Dentro de uma transação)
        // Usar transações garante que a operação seja atômica: ou tudo acontece, ou nada acontece.
        DB::beginTransaction();
        try {
            // Cria o registro na tabela pivot
            $beeAccessory = BeeAccessory::create([
                'fk_cosmetic_status' => $unequippedStatus->id_cosmetic_status,
                'fk_bee' => $bee->id_bee,
                'fk_accessory' => $accessory->id_accessory,
            ]);

            // Deduzir os girassóis da conta do usuário
            $account->sunflowers_account -= $accessory->price_accessory;
            $account->save(); // Salva a conta com o novo saldo

            DB::commit(); // Confirma a transação

            return response()->json([
                'status' => true,
                'message' => 'Acessório comprado e adicionado ao inventário com sucesso!',
                'data' => $beeAccessory
            ], 201); // 201 Created

        } catch (\Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            return response()->json([
                'status' => false,
                'message' => 'Erro ao processar a compra do acessório: ' . $e->getMessage()
            ], 500);
        }
    }

   /**
     * Alterna o status de um acessório para equipado/desequipado.
     * Desequipa outros acessórios de mesmo type_accessory para a mesma abelha.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $beeAccessoryId O ID do registro em bee_accessories que será equipado.
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleEquip(Request $request, $beeAccessoryId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['status' => false, 'message' => 'Usuário não autenticado.'], 401);
        }

        $bee = $user->account->bee;
        if (!$bee) {
            return response()->json(['status' => false, 'message' => 'Abelha não encontrada para este usuário.'], 404);
        }

        // 1. Encontrar o registro de BeeAccessory que o usuário quer equipar/desequipar
        $targetBeeAccessory = BeeAccessory::with('accessory', 'cosmeticStatus') // Carrega o acessório e o status relacionado
                                          ->where('id_bee_accessories', $beeAccessoryId)
                                          ->where('fk_bee', $bee->id_bee) // Garante que a abelha do usuário possui este acessório
                                          ->first();

        if (!$targetBeeAccessory) {
            return response()->json(['status' => false, 'message' => 'Acessório não encontrado no inventário da sua abelha.'], 404);
        }

        // 2. Obter os status "equipped" e "unequipped"
        $equippedStatus = CosmeticStatus::where('type_cosmetic_status', 'equipped')->first();
        $unequippedStatus = CosmeticStatus::where('type_cosmetic_status', 'unequipped')->first();

        if (!$equippedStatus || !$unequippedStatus) {
            return response()->json(['status' => false, 'message' => 'Erro interno: Status de cosmético não configurado corretamente.'], 500);
        }

        // 3. Determinar o tipo do acessório alvo (chapéu, óculos, etc.)
        // O valor virá do ENUM na sua tabela accessories
        $accessoryType = $targetBeeAccessory->accessory->type_accessory;

        DB::beginTransaction();
        try {
            // Lógica de toggle:
            if ($targetBeeAccessory->cosmeticStatus->type_cosmetic_status === 'equipped') {
                // Se já estiver equipado, desequipa
                $targetBeeAccessory->update(['fk_cosmetic_status' => $unequippedStatus->id_cosmetic_status]);
                $message = 'Acessório desequipado com sucesso!';
            } else {
                // Se estiver desequipado, equipa.
                // Primeiro, desequipa TODOS os outros acessórios do MESMO TIPO para esta abelha.
                // O 'whereHas' aqui verifica se o acessório relacionado tem o 'type_accessory' correspondente
                BeeAccessory::where('fk_bee', $bee->id_bee)
                            ->whereHas('accessory', function ($query) use ($accessoryType) {
                                $query->where('type_accessory', $accessoryType);
                            })
                            ->where('fk_cosmetic_status', $equippedStatus->id_cosmetic_status) // Apenas os que já estão equipados
                            ->update(['fk_cosmetic_status' => $unequippedStatus->id_cosmetic_status]);

                // Agora, equipa o acessório alvo
                $targetBeeAccessory->update(['fk_cosmetic_status' => $equippedStatus->id_cosmetic_status]);
                $message = 'Acessório equipado com sucesso!';
            }

            DB::commit();
            return response()->json(['status' => true, 'message' => $message], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Erro ao processar a requisição: ' . $e->getMessage()
            ], 500);
        }
    }
}