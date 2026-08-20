import { NavLink } from "react-router-dom";

import "./sidebar.css";

function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <h2>Financeiro</h2>
            </div>


            <nav className="sidebar-nav">

                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>

                <NavLink to="/movimentos">
                    Movimentos
                </NavLink>

                <NavLink to="/contas">
                    Contas
                </NavLink>

                <NavLink to="/categorias">
                    Categorias
                </NavLink>

            </nav>


            <div className="sidebar-footer">

                <NavLink to="/configuracoes">
                    Configurações
                </NavLink>

            </div>

        </aside>
    );
}

export default Sidebar;