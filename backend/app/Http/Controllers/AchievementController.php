<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Achievement;

class AchievementController extends Controller
{
    public function index(Request $request){
        $achievement = Achievement::paginate(6); // 6 por página, por exemplo
        return response()->json($achievement);
    }
   
}
