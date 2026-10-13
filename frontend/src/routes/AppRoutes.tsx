import { lazy, Suspense } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";

const Login = lazy(() => import("../pages/login/Login"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Movimentos = lazy(() => import("../pages/movimentos/Movimentos"));
const Contas = lazy(() => import("../pages/contas/Contas"));
const Categorias = lazy(() => import("../pages/categorias/Categorias"));
const Cadastro = lazy(() => import("../pages/cadastro/Cadastro"));
const Configuracoes = lazy(() => import("../pages/configuracoes/Configuracoes"));

function AppRoutes() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div className="route-loading" role="status">Carregando página...</div>}>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/cadastro"
                    element={<Cadastro />}
                />
                
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/configuracoes" element={<Configuracoes />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/movimentos" element={<Movimentos />} />
                        <Route path="/contas" element={<Contas />} />
                        <Route path="/categorias" element={<Categorias />} />
                    </Route>                    
                </Route>

                {/* Qualquer rota inexistente volta pro login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default AppRoutes;
