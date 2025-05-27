<?php

use App\Http\Controllers\AccessoryController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BeeAccessoryController;
use App\Http\Controllers\BeeController;
use App\Http\Controllers\UserController;
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

Route::get('/types', [TypeController::class, 'index']);

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/store', [CategoryController::class, 'store']);
    Route::get('/{id}', [CategoryController::class, 'show']);
    Route::put('/{id}', [CategoryController::class, 'update']);
    Route::delete('/{id}', [CategoryController::class, 'destroy']);
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
    Route::get('/annual/charts', [PendenceController::class, 'getAnnualChartsData']);
    Route::get('/monthly/evolution', [PendenceController::class, 'getMonthlyEvolution']);
    Route::get('/monthly/charts', [PendenceController::class, 'getMonthlyChartsData']);
    Route::get('/last', [PendenceController::class, 'getLastPendencesByUser']);
    Route::get('/monthly', [PendenceController::class, 'getMonthlyPendences']);
    Route::get('/monthly/type', [PendenceController::class, 'getMonthlyPendencesByType']);
    Route::get('/{id}', [PendenceController::class, 'show']);
    Route::post('/', [PendenceController::class, 'store']);
    Route::put('/{id}', [PendenceController::class, 'update']);
    Route::delete('/{id}', [PendenceController::class, 'destroy']);
});

Route::get('/bee', [BeeController::class, 'showBee'])->middleware('auth:sanctum');
Route::get('/accessories', [AccessoryController::class, 'index']);

Route::prefix('bee-accessories')->group(function () {
    Route::post('/buy', [BeeAccessoryController::class, 'store'])->middleware('auth:sanctum');
    Route::put('/{id}/toggle-equip', [BeeAccessoryController::class, 'toggleEquip'])->middleware('auth:sanctum');
});

Route::get('/pendings/monthly', [PendingController::class, 'getMonthlyPendingsData']);
