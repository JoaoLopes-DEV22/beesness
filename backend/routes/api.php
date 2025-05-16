<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AuthenticateAPI;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TypeController;
use App\Http\Controllers\TransactionController;

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

Route::middleware(AuthenticateAPI::class)->group(function () {
    // Route::get('/user', function () {
    //     return response()->json([
    //         'success' => true,
    //         'user' => auth()->user()
    //     ]);
    // });
});
