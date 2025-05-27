<?php

namespace App\Http\Controllers;

use App\Models\Decoration;
use Illuminate\Http\Request;

class DecorationController extends Controller
{
    public function index(Request $request){
        $decoration = Decoration::paginate(6); // 6 por página, por exemplo
        return response()->json($decoration);
    }
}
