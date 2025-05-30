<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Access; // Importe o modelo Access
use Carbon\Carbon;     // Importe a classe Carbon para lidar com datas
use Illuminate\Support\Facades\Log;

// Se você tiver um modelo Account e ele não for o mesmo que User, importe-o também
// use App\Models\Account; 

class AuthController extends Controller
{
    public function auth(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ], [
            'email.required' => 'Campo email é obrigatório',
            'email.email' => 'E-mail inválido',
            'password' => 'Campo senha é obrigatório'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            // --- INÍCIO DA LÓGICA DE CORREÇÃO PARA fk_account ---

            $accountId = null;


            if ($user->account) { // Verifica se o relacionamento 'account' existe e não é nulo
                $accountId = $user->account->id_account; // Acessa o id_account através do relacionamento
            } 
          

            // --- FIM DA LÓGICA DE CORREÇÃO ---


            // Lógica para registrar o acesso
            try {
                if ($accountId) { // Garante que temos um ID de conta antes de tentar registrar
                    Access::create([
                        'date_access' => Carbon::now()->toDateString(),
                        'fk_account' => $accountId,
                    ]);
                } else {
                    Log::error('Não foi possível registrar acesso: id_account não encontrado para o usuário ' . $user->id);
                }
            } catch (\Exception $e) {
                Log::error('Erro ao registrar acesso para o usuário ' . $user->id . ': ' . $e->getMessage());
            }

            return response()->json([
                'status' => true,
                'message' => 'Login realizado com sucesso',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    // Talvez adicione o id_account aqui também para retorno
                    'account_id' => $accountId,
                ],
                'token' => $token,
            ], 200);
        }

        return response()->json([
            'status' => false,
            'message' => 'Credenciais inválidas'
        ], 401);
    }
}