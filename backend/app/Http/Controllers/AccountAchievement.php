<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Achievement;
use App\Models\AccountAchievement;
use App\Models\User;
use App\Models\Bee; // Importar Bee
use App\Models\Account; // Importar Account
use App\Models\Category;
use App\Models\Transaction;
use App\Models\Pending;
use App\Models\HiveDecoration; // Assumindo este nome agora
use App\Models\BeeAccessory;   // Assumindo este nome agora
use App\Models\Goal;
use App\Models\Decoration;
use App\Models\Accessory;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB; // Importar Facade DB para transações
use Illuminate\Support\Facades\Log;

class AchievementController extends Controller
{
    /**
     * Retorna as conquistas paginadas com o status de conclusão da conta.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Usuário não autenticado.'], 401);
        }

        $account = $user->account; // Acessa a conta do usuário

        if (!$account) {
            return response()->json(['message' => 'Conta associada ao usuário não encontrada.'], 404);
        }

        // Carregar a abelha da conta, se necessário, para a lógica de verificação
        $account->load('bee'); // Carrega a abelha associada à conta

        $achievements = Achievement::paginate(6);

        $achievements->getCollection()->transform(function ($achievement) use ($account, $user) {

            $accountAchievement = AccountAchievement::firstOrCreate(
                [
                    'fk_account' => $account->id_account,
                    'fk_achievements' => $achievement->id_achievement,
                ]
            );

            if (!$accountAchievement->is_completed) {
                $isCompleted = false;

                // --- Lógica de Verificação para CADA Conquista ---
                switch ($achievement->title_goal) {
                    case 'Mel na chupeta':
                        $isCompleted = true;
                        break;

                    case 'CAF(Cadastro de Abelha Física)':
                        $bee = $account->bee;
                        // Assumindo que o nome inicial padrão é 'Mel' e a abelha já existe
                        $isCompleted = ($bee && $bee->name_bee !== 'Mel');
                        break;

                    case 'Cada um no seu favo':
                        $hasIncome = $account->categories()->where('fk_type', 1)->exists(); // 1 para Receita
                        $hasExpense = $account->categories()->where('fk_type', 2)->exists(); // 2 para Despesa
                        $isCompleted = $hasIncome && $hasExpense;
                        break;

                    case 'Contabeelidade':
                        $hasIncomeTrans = $account->transactions()->where('fk_type', 1)->exists(); // 1 para Receita
                        $hasExpenseTrans = $account->transactions()->where('fk_type', 2)->exists(); // 2 para Despesa
                        $isCompleted = $hasIncomeTrans && $hasExpenseTrans;
                        break;

                    case 'O néctar do estilo':
                        // Estes campos devem estar na tabela 'accounts'
                        $defaultProfilePic = '/assets/profiles/img_profile.png'; // Caminho padrão
                        $defaultBanner = '/assets/banners/img_banner.png'; // Caminho padrão
                        // Capturando os valores das propriedades do usuário
                        $userProfilePic = $user->profile_picture;
                        $userBannerPic = $user->banner_picture;
                        $hasCustomProfilePic = $userProfilePic && $userProfilePic !== $defaultProfilePic;
                        $hasCustomBanner = $userBannerPic && $userBannerPic !== $defaultBanner;
                        $isCompleted = $hasCustomProfilePic && $hasCustomBanner;

                        break;

                    case 'Zangado com as dívidas':
                        $isCompleted = $account->pendings()->where('fk_pending_status', 2)->exists(); // 2 para "concluído"
                        break;

                    case 'Melhor operária':
                        // Este campo deve estar na tabela 'accounts'
                        $isCompleted = $account->login_streak_weeks >= 4;
                        break;

                    case 'Arquiteto de favos':
                        $equippedDecorationsCount = $account->hiveDecorations()->whereNotNull('position_hive_decoration')->whereNot('position_hive_decoration', 'none')->count();
                        $isCompleted = $equippedDecorationsCount >= 2;
                        break;

                    case 'Polinizador':
                        // Este campo está na tabela 'accounts'
                        $isCompleted = $account->sunflowers_account >= 500;
                        break;

                    case 'Cumprindo prazzzo':
                        // Verifica se existe pelo menos um objetivo (goal) para a conta com fk_condition = 2 (indicando que foi completo).
                        $isCompleted = $account->goals()
                            ->where('fk_condition', 2)
                            ->exists();
                        break;


                    case 'Enxarme completo':
                        $bee = $account->bee;
                        $isCompleted = false;
                        if ($bee) {
                            $hasHead = $bee->beeAccessories()->whereHas('accessory', function ($q) {
                                $q->where('type_accessory', 'head');
                            })->where('fk_cosmetic_status', 1)->exists(); // 1 para equipado
                            $hasFace = $bee->beeAccessories()->whereHas('accessory', function ($q) {
                                $q->where('type_accessory', 'face');
                            })->where('fk_cosmetic_status', 1)->exists();
                            $hasBody = $bee->beeAccessories()->whereHas('accessory', function ($q) {
                                $q->where('type_accessory', 'body');
                            })->where('fk_cosmetic_status', 1)->exists();
                            $isCompleted = $hasHead && $hasFace && $hasBody;
                        }
                        break;

                    case 'M-El Dourado':
                        $estatuaCampeaoBought = $account->hiveDecorations()->whereHas('decoration', function ($q) {
                            $q->where('name_decoration', 'Estátua do campeão');
                        })->exists();
                        $isCompleted = $estatuaCampeaoBought;
                        break;
                }

                if ($isCompleted) {
                    $accountAchievement->is_completed = true;
                    $accountAchievement->completed_at = Carbon::now();
                    $accountAchievement->save();
                }
            }

            $achievement->account_status = [
                'is_completed' => $accountAchievement->is_completed,
                'is_claimed' => $accountAchievement->is_claimed,
                'completed_at' => $accountAchievement->completed_at,
                'claimed_at' => $accountAchievement->claimed_at,
            ];

            return $achievement;
        });

        return response()->json($achievements);
    }

    /**
     * Resgata a recompensa de uma conquista para a conta logada.
     */
    public function claim(Request $request, $id)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Usuário não autenticado.'], 401);
        }

        $account = $user->account;

        if (!$account) {
            return response()->json(['message' => 'Conta associada ao usuário não encontrada.'], 404);
        }

        // Carrega a abelha da conta. É CRUCIAL ter a abelha para atualizar o XP/Nível.
        $bee = $account->bee;
        if (!$bee) {
            return response()->json(['message' => 'Abelha associada à conta não encontrada.'], 404);
        }

        $achievement = Achievement::find($id);
        if (!$achievement) {
            return response()->json(['message' => 'Conquista não encontrada.'], 404);
        }

        $accountAchievement = AccountAchievement::where('fk_account', $account->id_account)
            ->where('fk_achievements', $achievement->id_achievement)
            ->first();

        if (!$accountAchievement) {
            return response()->json(['message' => 'Conquista não iniciada para esta conta.'], 400);
        }

        if (!$accountAchievement->is_completed) {
            return response()->json(['message' => 'Conquista ainda não foi completada.'], 400);
        }

        if ($accountAchievement->is_claimed) {
            return response()->json(['message' => 'Recompensa já foi resgatada para esta conquista.'], 400);
        }

        DB::beginTransaction(); // Usa DB::beginTransaction() para transações

        try {
            // 1. Adicionar Girassóis à CONTA
            $account->sunflowers_account += $achievement->sunflowers_achievement;
            $account->save();

            // 2. Calcular e Adicionar XP e Nível à ABELHA
            $currentExperienceBee = $bee->experience_bee;
            $currentLevelBee = $bee->level_bee;
            $xpGained = $achievement->experience_achievement;

            $newTotalExperienceBee = $currentExperienceBee + $xpGained;

            // Lógica de nível: a cada 1000 XP, ganha 1 nível
            $levelUp = floor($newTotalExperienceBee / 1000); // Parte inteira para o nível
            $remainingXp = $newTotalExperienceBee % 1000;    // Parte decimal para o XP restante

            $bee->level_bee += $levelUp;
            $bee->experience_bee = $remainingXp;
            $bee->save();

            // 3. Marcar a Conquista como Resgatada na account_achievements
            $accountAchievement->is_claimed = true;
            $accountAchievement->claimed_at = Carbon::now();
            $accountAchievement->save();

            DB::commit();

            return response()->json([
                'message' => 'Recompensa resgatada com sucesso!',
                'new_sunflowers' => $account->sunflowers_account,
                'new_bee_level' => $bee->level_bee,       // Retornar nível da abelha
                'new_bee_experience' => $bee->experience_bee, // Retornar XP da abelha
                'claimed_achievement' => $accountAchievement->only(['is_claimed', 'claimed_at']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro interno ao resgatar a recompensa.', 'error' => $e->getMessage()], 500);
        }
    }
}
