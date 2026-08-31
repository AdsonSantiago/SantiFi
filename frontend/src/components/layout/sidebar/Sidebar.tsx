import { NavLink } from "react-router-dom";

import "./sidebar.css";

type SidebarProps = {
  isOpen?: boolean;
  collapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
};

const menuItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: "⌂",
    end: true,
  },
  {
    to: "/movimentos",
    label: "Movimentos",
    icon: "↗",
  },
  {
    to: "/contas",
    label: "Contas",
    icon: "▣",
  },
  {
    to: "/categorias",
    label: "Categorias",
    icon: "◈",
  },
];

function Sidebar({
  isOpen = true,
  collapsed = false,
  onClose,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          className="sidebar-overlay"
          type="button"
          aria-label="Fechar menu"
          onClick={onClose}
        />
      )}

      <aside
        id="main-sidebar"
        className={`sidebar ${isOpen ? "sidebar-open" : ""} ${
          collapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">F</span>

            <div className="sidebar-brand-text">
              <strong>Financeiro</strong>
              <span>Controle inteligente</span>
            </div>
          </div>

          <button
            className="sidebar-close"
            type="button"
            aria-label="Fechar menu"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <button
          className="sidebar-collapse-button"
          type="button"
          aria-label={
            collapsed ? "Expandir menu lateral" : "Recolher menu lateral"
          }
          aria-expanded={!collapsed}
          aria-controls="main-sidebar"
          onClick={onToggleCollapse}
        >
          <span aria-hidden="true">{collapsed ? "→" : "←"}</span>
        </button>

        <nav
          className="sidebar-nav"
          aria-label="Navegação principal"
        >
          <span className="sidebar-section-title">
            Menu principal
          </span>

          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span
                className="sidebar-link-icon"
                aria-hidden="true"
              >
                {item.icon}
              </span>

              <span className="sidebar-link-label">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-section-title">
            Preferências
          </span>

          <NavLink
            to="/configuracoes"
            onClick={onClose}
            title={collapsed ? "Configurações" : undefined}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span
              className="sidebar-link-icon"
              aria-hidden="true"
            >
              ⚙
            </span>

            <span className="sidebar-link-label">
              Configurações
            </span>
          </NavLink>

          <div className="sidebar-user">
            <div className="sidebar-avatar">AS</div>

            <div className="sidebar-user-info">
              <strong>Adson Santiago</strong>
              <span>Conta pessoal</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;