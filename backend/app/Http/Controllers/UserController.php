<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Account; // Adicione esta linha no início do arquivo
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{

    public function index()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Nenhum usuário autenticado.'
                ], 401);
            }

            return response()->json([
                'status' => true,
                'data' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'birth' => $user->birth,
                    'profile_picture' => $user->profile_picture,
                    'banner_picture' => $user->banner_picture,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Erro ao buscar usuário: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'birth' => 'sometimes|required|date',
            'password' => 'sometimes|required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()
            ], 422);
        }

        try {
            $user->update($request->only(['name', 'email', 'birth', 'password']));
            if ($request->has('password')) {
                $user->password = Hash::make($request->password);
                $user->save();
            }
            return response()->json([
                'status' => true,
                'message' => 'Perfil atualizado com sucesso!'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Erro ao atualizar perfil: ' . $e->getMessage()
            ], 500);
        }
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required',
            'confirmPassword' => 'required|same:password',
            'date' => 'required|date',
        ], [
            'name.required' => 'Campo nome é obrigatório',
            'email.required' => 'Campo email é obrigatório',
            'email.email' => 'E-mail inválido',
            'email.unique' => 'Este e-mail já está registrado',
            'password.required' => 'Campo senha é obrigatório',
            'confirmPassword.required' => 'Campo confirmação de senha é obrigatório',
            'confirmPassword.same' => 'As senhas não coincidem',
            'date.required' => 'Campo data é obrigatório',
            'date.date' => 'Campo data é inválido',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()
            ], 422);
        }

        try {
            // Cria o usuário
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'birth' => \Carbon\Carbon::parse($request->date)->format('Y-m-d'),
                'password' => Hash::make($request->password),
                'profile_picture' => '/assets/profiles/img_profile.png',
                'banner_picture' => '/assets/banners/img_banner.png',
            ]);

            // Cria a conta associada ao usuário
            $account = Account::create([
                'incomes_account' => 0,
                'expenses_account' => 0,
                'balance_account' => 0,
                'sunflowers_account' => 0,
                'fk_user' => $user->id // Usa o ID do usuário recém-criado
            ]);

            $categories = [
            [
                'title_category' => 'sem categoria',
                'color_category' => '#818B92',
                'fk_type' => '2',
                'fk_account' => $account->id_account,
            ],
            [
                'title_category' => 'alimentação',
                'color_category' => '#818B92',
                'fk_type' => '2',
                'fk_account' => $account->id_account,
            ],
            [
                'title_category' => 'lazer',
                'color_category' => '#818B92',
                'fk_type' => '2',
                'fk_account' => $account->id_account,
            ],
            [
                'title_category' => 'moradia',
                'color_category' => '#818B92',
                'fk_type' => '2',
                'fk_account' => $account->id_account,
            ],
            [
                'title_category' => 'transporte',
                'color_category' => '#818B92',
                'fk_type' => '2',
                'fk_account' => $account->id_account,
            ],
            [
                'title_category' => 'saúde',
                'color_category' => '#818B92',
                'fk_type' => '2',
                'fk_account' => $account->id_account,
            ],
            [
                'title_category' => 'educação',
                'color_category' => '#818B92',
                'fk_type' => '2',
                'fk_account' => $account->id_account,
            ],
            [
                'title_category' => 'vestuário',
                'color_category' => '#818B92',
                'fk_type' => '2',
                'fk_account' => $account->id_account,
            ],
            [
                'title_category' => 'serviços',
                'color_category' => '#818B92',
                'fk_type' => '2',
                'fk_account' => $account->id_account,
            ],
            [
                'title_category' => 'sem categoria',
                'color_category' => '#818B92',
                'fk_type' => '1',
                'fk_account' => $account->id_account,
            ],
            [
                'title_category' => 'salário',
                'color_category' => '#818B92',
                'fk_type' => '1',
                'fk_account' => $account->id_account,
            ],
            [
                'title_category' => 'freelance',
                'color_category' => '#818B92',
                'fk_type' => '1',
                'fk_account' => $account->id_account,
            ],
            [
                'title_category' => 'venda',
                'color_category' => '#818B92',
                'fk_type' => '1',
                'fk_account' => $account->id_account,
            ],
            [
                'title_category' => 'aposentadoria',
                'color_category' => '#818B92',
                'fk_type' => '1',
                'fk_account' => $account->id_account,
            ],
        ];

        DB::table('categories')->insert($categories);

        // Cria a abelha padrão do usuário
        DB::table('bees')->insert([
            'name_bee' => 'Mel',
            'experience_bee' => 0,
            'level_bee' => 0,
            'fk_account' => $account->id_account,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

            return response()->json([
                'status' => true,
                'message' => 'Usuário registrado com sucesso!',
                'data' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Erro ao registrar usuário: ' . $e->getMessage()
            ], 500);
        }
    }
    


    public function logout(Request $request)
    {
        try {
            if (Auth::check()) {
                $request->user()->currentAccessToken()->delete();
                return response()->json([
                    'status' => true,
                    'message' => 'Logout realizado com sucesso!'
                ], 200);
            }

            return response()->json([
                'status' => false,
                'message' => 'Nenhum usuário autenticado.'
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Erro ao realizar logout: ' . $e->getMessage()
            ], 500);
        }
    }
}
