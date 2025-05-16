import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js"
import Login from "./pages/Login.js"
import ProtectedRoute from "./components/ProtectedRoute.js";
import RecuperarSenha from "./pages/RecuperarSenha.js";
import SignUp from "./pages/SignUp.js";
import EditProfile from "./pages/EditProfile.js";
import AllTransactions from "./pages/AllTransactions.js";
import Dashboard from "./pages/Dashboard.js";
import Perfil from "./pages/Perfil.js";
import Hive from "./pages/Hive.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<RecuperarSenha />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/all-transactions" element={
          <ProtectedRoute>
            <AllTransactions />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        } />
        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />
        <Route path="/hive" element={
          <ProtectedRoute>
            <Hive />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
