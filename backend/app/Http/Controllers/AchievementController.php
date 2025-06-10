<?php

namespace App\Http\Controllers;

use App\Models\Access;
use Illuminate\Support\Facades\Log; // Para a classe Log
use Illuminate\Support\Facades\DB;  // Para a classe DB
use Illuminate\Http\Request;
use App\Models\Achievement;
use App\Models\AccountAchievement; // Agora sim, este é o modelo correto!
use App\Models\User; // Ainda precisamos do User para pegar a conta
use App\Models\Bee; // Modelo da abelha, mas será acessado via Account
use App\Models\Category; // Categorias, acessadas via Account
use App\Models\Transaction; // Transações, acessadas via Account
use App\Models\Pending; // Pendências, acessadas via Account
use App\Models\UserDecoration; // Decorações do usuário, acessadas via Account
use App\Models\UserAccessory; // Acessórios do usuário, acessados via Account
use App\Models\Goal; // Metas, acessadas via Account
use App\Models\Decoration;
use App\Models\Accessory;
use Carbon\Carbon;

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

        // CHAVE DA MUDANÇA: Obtenha a conta associada ao usuário logado.
        // A partir de agora, todas as verificações serão feitas através desta $account.
        $account = $user->account;

        if (!$account) {
            // Se um usuário não tem uma conta, algo está errado na sua lógica de negócio ou BD.
            return response()->json(['message' => 'Conta associada ao usuário não encontrada.'], 404);
        }

        $achievements = Achievement::paginate(6);

        $achievements->getCollection()->transform(function ($achievement) use ($account, $user) { // <-- Passamos $account para o closure
            // Encontra ou cria o registro de progresso da CONTA para esta conquista.
            $accountAchievement = AccountAchievement::firstOrCreate(
                [
                    'fk_account' => $account->id_account, // Use o ID da conta
                    'fk_achievements' => $achievement->id_achievement,
                ]
            );

            // Se a conquista já estiver completa para esta conta, não precisamos re-verificar.
            if (!$accountAchievement->is_completed) {
                $isCompleted = false;

                // --- Lógica de Verificação para CADA Conquista (AGORA VIA $ACCOUNT) ---
                switch ($achievement->title_goal) {
                    case 'Mel na chupeta':
                        // Conquista de "primeiro acesso".
                        // Se não foi concluída ainda, marca como concluída no primeiro acesso à página.
                        $isCompleted = true;
                        break;

                    case 'CAF(Cadastro de Abelha Física)':
                        // A abelha é da conta? Se sim, acesse via $account->bee
                        // Se a abelha é do usuário (e o usuário tem 1 abelha), pode ser $user->bee.
                        // Assumindo que a abelha está ligada à conta:
                        $bee = $account->bee;
                        $isCompleted = ($bee && $bee->name_bee !== 'Mel'); // Substitua pelo seu nome padrão inicial
                        break;

                    case 'Cada um no seu favo':
                        // Categorias da conta
                        $hasIncome = $account->categories()->where('fk_type', 1)->exists();
                        $hasExpense = $account->categories()->where('fk_type', 2)->exists();
                        $isCompleted = $hasIncome && $hasExpense;
                        break;

                    case 'Contabeelidade':
                        // Transações da conta
                        $hasIncomeTrans = $account->transactions()->where('fk_type', 1)->exists();
                        $hasExpenseTrans = $account->transactions()->where('fk_type', 2)->exists();
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
                        // Pendências da conta
                        $isCompleted = $account->pendings()->where('fk_type', 2)->exists(); // 2 para "concluído"
                        break;

                    case 'Melhor operária':
                        // 1. Define o período de 4 semanas a partir de hoje
                        $fourWeeksAgo = Carbon::now()->subWeeks(4);

                        // 2. Busca os acessos da conta nas últimas 4 semanas
                        // Usamos selectRaw para extrair o número da semana do ano e o ano,
                        // garantindo que semanas em anos diferentes sejam tratadas corretamente.
                        $accessWeeks = Access::where('fk_account', $account->id_account)
                            ->where('date_access', '>=', $fourWeeksAgo)
                            ->selectRaw('YEAR(date_access) as year, WEEK(date_access) as week_number')
                            ->distinct() // Pega apenas semanas únicas
                            ->get();

                        // 3. Verifica se há pelo menos 4 semanas distintas com acesso
                        $isCompleted = $accessWeeks->count() >= 4;
                        break;

                    case 'Arquiteto de favos':
                        // Decorações da conta
                        $equippedDecorationsCount = $account->hiveDecorations()->whereNotNull('position_hive_decoration')->whereNot('position_hive_decoration', 'none')->count();
                        $isCompleted = $equippedDecorationsCount >= 2;
                        break;

                    case 'Polinizador':
                        // Girassóis da conta
                        $isCompleted = $account->sunflowers_account >= 500;
                        break;

                    case 'Cumprindo prazzzo':
                        // Verifica se existe algum goal associado à conta com fk_condition igual a 2
                        $isCompleted = $account->goals()->where('fk_condition', 2)->exists();
                        break;

                    case 'Enxarme completo':
                        // Acessórios da conta
                        $hasHead = $account->bee->beeAccessories()->whereHas('accessory', function ($q) {
                            $q->where('type_accessory', 'head');
                        })->where('fk_cosmetic_status', 1)->exists(); // 1 para equipado
                        $hasFace = $account->bee->beeAccessories()->whereHas('accessory', function ($q) {
                            $q->where('type_accessory', 'face');
                        })->where('fk_cosmetic_status', 1)->exists();
                        $hasBody = $account->bee->beeAccessories()->whereHas('accessory', function ($q) {
                            $q->where('type_accessory', 'body');
                        })->where('fk_cosmetic_status', 1)->exists();
                        $isCompleted = $hasHead && $hasFace && $hasBody;
                        break;

                    case 'M-El Dourado':

                        // 2. EXECUTANDO A CONSULTA E CONTANDO
                        $estatuaCampeaoCount = $account->hiveDecorations()
                            ->where('fk_decoration', 17) // ID da Estátua do Campeão
                            ->count();

                        // 3. DEFININDO O STATUS DA CONQUISTA
                        // Se a contagem for exatamente 1 (ou > 0, dependendo da sua regra de negócio), a conquista é completada
                        $isCompleted = ($estatuaCampeaoCount === 1); // Ou $estatuaCampeaoCount > 0;
                        break;
                }

                // Se a condição for atendida e a conquista não estava completa, atualiza o registro da conta.
                if ($isCompleted) {
                    $accountAchievement->is_completed = true;
                    $accountAchievement->completed_at = Carbon::now();
                    $accountAchievement->save();
                }
            }

            // Anexa o status de conclusão e resgate à conquista para o frontend.
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

        // --- INÍCIO DA TRANSAÇÃO DE BANCO DE DADOS ---
        // Isso garante que todas as operações dentro do bloco 'try' sejam bem-sucedidas,
        // ou que todas sejam revertidas em caso de erro.
        DB::beginTransaction();
        try {
            // 1. Adicionar Girassóis à CONTA
            // **VERIFIQUE:** 'sunflowers_account' é o nome da coluna correto na sua tabela 'accounts'?
            // E 'reward_sunflowers' é o nome da coluna correto no seu modelo 'Achievement'?
            $account->sunflowers_account += $achievement->sunflowers_achievement;
            $account->save(); // Salva a conta atualizada

            // 2. Calcular e Adicionar XP e Nível à ABELHA
            $bee = $account->bee; // Acessa a abelha da conta

            if (!$bee) {
                // Se a abelha não existir, revertemos todas as mudanças feitas na transação.
                DB::rollBack();
                return response()->json(['message' => 'Abelha associada à conta não encontrada para aplicar XP/Nível.'], 404);
            }

            // **VERIFIQUE:** 'experience_bee' e 'level_bee' são os nomes das colunas corretos na sua tabela 'bees'?
            // E 'reward_experience' é o nome da coluna correto no seu modelo 'Achievement'?
            $currentBeeExperience = $bee->experience_bee;
            $currentBeeLevel = $bee->level_bee;
            $xpGained = $achievement->experience_achievement;

            $newTotalBeeExperience = $currentBeeExperience + $xpGained;

            // Lógica de nível: a cada 1000 XP, ganha 1 nível (assumindo 1000 XP por nível para a abelha)
            $levelUp = floor($newTotalBeeExperience / 1000); // Calcula quantos níveis a abelha subiu
            $remainingXp = $newTotalBeeExperience % 1000;    // Calcula o XP restante para o próximo nível

            $bee->level_bee += $levelUp;
            $bee->experience_bee = $remainingXp;
            $bee->save(); // Salva a abelha atualizada

            // 3. Marcar a Conquista como Resgatada
            $accountAchievement->is_claimed = true;
            $accountAchievement->claimed_at = Carbon::now();
            $accountAchievement->save(); // Salva o status da conquista da conta

            DB::commit(); // Confirma todas as operações da transação no banco de dados

            // Retorna a resposta de sucesso com os dados atualizados
            return response()->json([
                'message' => 'Recompensa resgatada com sucesso!',
                'new_sunflowers' => $account->sunflowers_account,
                'new_bee_level' => $bee->level_bee,
                'new_bee_experience' => $bee->experience_bee,
                'claimed_at' => $accountAchievement->claimed_at,
                'status' => true // Confirma que a operação foi um sucesso
            ], 200);
        } catch (\Exception $e) {
            // Em caso de qualquer erro, reverte todas as operações da transação
            DB::rollBack();
            // Registre o erro em seus logs para depuração
            Log::error("Erro ao resgatar conquista: {$e->getMessage()} - Stack Trace: {$e->getTraceAsString()}");
            return response()->json(['message' => 'Erro interno ao resgatar a recompensa.', 'error' => $e->getMessage()], 500);
        }
    }
}
