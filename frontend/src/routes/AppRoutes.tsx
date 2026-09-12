import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Login from "../pages/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import Movimentos from "../pages/movimentos/Movimentos";
import Contas from "../pages/contas/Contas";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />
                        <Route
                            path="/movimentos"
                            element={<Movimentos />}
                        />
                        <Route
                            path="/contas"
                            element={<Contas />}
                        />
                    </Route>                    
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;