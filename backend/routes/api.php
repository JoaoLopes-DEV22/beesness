<?php

use App\Http\Controllers\AccessoryController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BeeAccessoryController;
use App\Http\Controllers\BeeController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AuthenticateAPI;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TypeController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\PendingController;

Route::post('/auth', [AuthController::class, 'auth']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/user', [UserController::class, 'index'])->middleware('auth:sanctum');
Route::put('/profile', [UserController::class, 'update'])->middleware('auth:sanctum');

Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories/store', [CategoryController::class, 'store']);
Route::get('/types', [TypeController::class, 'index']);
Route::post('/transactions', [TransactionController::class, 'store']);
Route::get('/transactions/last', [TransactionController::class, 'getLastTransactionsByUser']);
Route::get('/transactions/monthly', [TransactionController::class, 'getMonthlyTransactions']);
Route::get('/transactions/monthly/type', [TransactionController::class, 'getMonthlyTransactionsByType']);

Route::get('/bee', [BeeController::class, 'showBee'])->middleware('auth:sanctum');
Route::get('/accessories', [AccessoryController::class, 'index']);
Route::post('/bee-accessories/buy', [BeeAccessoryController::class, 'store'])->middleware('auth:sanctum');
Route::put('/bee-accessories/{id}/toggle-equip', [BeeAccessoryController::class, 'toggleEquip'])->middleware('auth:sanctum');

Route::get('/transactions/{id}', [TransactionController::class, 'show']); 
Route::put('/transactions/{id}', [TransactionController::class, 'update']); 
Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']); 

Route::get('/categories/{id}', [CategoryController::class, 'show']); 
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']); 

Route::get('/transactions/monthly/charts', [TransactionController::class, 'getMonthlyChartsData']);
Route::get('/pendings/monthly', [PendingController::class, 'getMonthlyPendingsData']);

// Rotas para gráficos anuais
Route::get('/transactions/annual/charts', [TransactionController::class, 'getAnnualChartsData']);
Route::get('/transactions/monthly/evolution', [TransactionController::class, 'getMonthlyEvolution']);


Route::middleware(AuthenticateAPI::class)->group(function () {
    // Route::get('/user', function () {
    //     return response()->json([
    //         'success' => true,
    //         'user' => auth()->user()
    //     ]);
    // });
});
