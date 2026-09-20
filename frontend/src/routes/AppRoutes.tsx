import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "../pages/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import Movimentos from "../pages/movimentos/Movimentos";
import Contas from "../pages/contas/Contas";
import Categorias from "../pages/categorias/Categorias";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/movimentos" element={<Movimentos />} />
                        <Route path="/contas" element={<Contas />} />
                        <Route path="/categorias" element={<Categorias />} />
                    </Route>                    
                </Route>

                {/* Qualquer rota inexistente volta pro login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;