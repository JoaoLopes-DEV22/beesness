<?php

namespace App\Http\Controllers;

use App\Models\Accessory;
use Illuminate\Http\Request;

class AccessoryController extends Controller
{
   public function index(Request $request)
{
    $accessories = Accessory::paginate(6); // 6 por página, por exemplo
    return response()->json($accessories);
}

}
