<?php

use App\Http\Controllers\AccessoryController;
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BeeAccessoryController;
use App\Http\Controllers\BeeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AccountController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DecorationController;
use App\Http\Controllers\HiveDecorationController;
use App\Http\Controllers\TypeController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\PendingController;
use App\Http\Controllers\SavingsController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\GoalTransactionController;

Route::post('/auth', [AuthController::class, 'auth']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/user', [UserController::class, 'index'])->middleware('auth:sanctum');
Route::put('/profile', [UserController::class, 'update'])->middleware('auth:sanctum');
Route::post('/upload-profile-image', [UserController::class, 'uploadProfileImage'])->middleware('auth:sanctum');
Route::post('/upload-banner-image', [UserController::class, 'uploadBannerImage'])->middleware('auth:sanctum');

Route::get('/types', [TypeController::class, 'index']);

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/store', [CategoryController::class, 'store']);
    Route::get('/{id}', [CategoryController::class, 'show']);
    Route::put('/{id}', [CategoryController::class, 'update']);
    Route::delete('/{id}', [CategoryController::class, 'destroy']);
});

Route::prefix('accounts')->group(function () {
    Route::get('/user/{userId}', [AccountController::class, 'getAccountByUserId']);
    Route::get('/{accountId}/values', [AccountController::class, 'getAccountValues']);
    Route::post('/{accountId}/update-values', [AccountController::class, 'updateAccountValues']);
});

Route::prefix('transactions')->group(function () {
    Route::get('/annual/charts', [TransactionController::class, 'getAnnualChartsData']);
    Route::get('/monthly/evolution', [TransactionController::class, 'getMonthlyEvolution']);
    Route::get('/monthly/charts', [TransactionController::class, 'getMonthlyChartsData']);
    Route::get('/last', [TransactionController::class, 'getLastTransactionsByUser']);
    Route::get('/monthly', [TransactionController::class, 'getMonthlyTransactions']);
    Route::get('/monthly/type', [TransactionController::class, 'getMonthlyTransactionsByType']);
    Route::get('/{id}', [TransactionController::class, 'show']);
    Route::post('/', [TransactionController::class, 'store']);
    Route::put('/{id}', [TransactionController::class, 'update']);
    Route::delete('/{id}', [TransactionController::class, 'destroy']);
});

Route::prefix('pendences')->group(function () {
    Route::get('/annual/charts', [PendingController::class, 'getAnnualChartsData']);
    Route::get('/monthly/evolution', [PendingController::class, 'getMonthlyEvolution']);
    Route::get('/monthly/charts', [PendingController::class, 'getMonthlyChartsData']);
    Route::get('/nearest', [PendingController::class, 'getNearestPendencesByUser']);
    Route::get('/monthly', [PendingController::class, 'getMonthlyPendences']);
    Route::get('/monthly/type', [PendingController::class, 'getMonthlyPendencesByType']);
    Route::get('/{id}', [PendingController::class, 'show']);
    Route::post('/', [PendingController::class, 'store']);
    Route::put('/{id}', [PendingController::class, 'update']);
    Route::delete('/{id}', [PendingController::class, 'destroy']);
});

Route::get('/bee', [BeeController::class, 'showBee'])->middleware('auth:sanctum');
Route::post('/bee/rename', [BeeController::class, 'rename'])->middleware('auth:sanctum');
Route::get('/accessories', [AccessoryController::class, 'index']);

Route::prefix('bee-accessories')->group(function () {
    Route::post('/buy', [BeeAccessoryController::class, 'store'])->middleware('auth:sanctum');
    Route::put('/{id}/toggle-equip', [BeeAccessoryController::class, 'toggleEquip'])->middleware('auth:sanctum');
});

Route::prefix('hive-decorations')->group(function () {
    Route::post('/buy', [HiveDecorationController::class, 'purchaseDecoration'])->middleware('auth:sanctum');
    Route::put('/{hiveDecoration}/equip/{positionSlot}', [HiveDecorationController::class, 'equipDecoration'])->middleware('auth:sanctum');
    Route::put('/{hiveDecoration}/unequip/{positionSlot}', [HiveDecorationController::class, 'unequipDecoration'])->middleware('auth:sanctum');
    Route::get('/user-inventory', [HiveDecorationController::class, 'getUserHiveDecorations'])->middleware('auth:sanctum');
});

Route::get('/decorations', [DecorationController::class, 'index']);

Route::get('/achievements', [AchievementController::class, 'index'])->middleware('auth:sanctum');
Route::post('/achievements/{id}/claim', [AchievementController::class, 'claim'])->middleware('auth:sanctum');


Route::get('/pendings/monthly', [PendingController::class, 'getMonthlyPendingsData']);

Route::post('/savings/{savings}/update-balance', [SavingsController::class, 'updateBalance']);

Route::post('/savings/{savings}/update-balance', [SavingsController::class, 'updateSavingsBalance']);

// Atualiza saldo pelo ID da conta
Route::post('/accounts/{account}/update-savings-balance', [SavingsController::class, 'updateSavingsBalanceByAccount']);


Route::get('/savings/account/{accountId}', [SavingsController::class, 'getByAccount']);

// Busca transações da poupança
Route::get('/savings/{savingsId}/transactions', [SavingsController::class, 'getTransactions']);

Route::post('/savings/transactions', [SavingsController::class, 'createTransaction']);

Route::get('/goals', [GoalController::class, 'index']);
Route::post('/goals', [GoalController::class, 'store']);

// Rotas para metas
Route::get('/goals/{goal}', [GoalController::class, 'show']); // Nova rota GET
Route::put('/goals/{goal}', [GoalController::class, 'update']);
Route::put('/goals/{goal}/update-value', [GoalController::class, 'updateGoalValue']);
Route::delete('/goals/{goal}', [GoalController::class, 'destroy']);
Route::post('/goal-transactions', [GoalController::class, 'storeTransaction']);
