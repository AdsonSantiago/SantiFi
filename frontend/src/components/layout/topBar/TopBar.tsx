import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  logout,
} from "../../../services/authService";

import type {
  CurrentUser,
} from "../../../services/authService";

import "./topBar.css";

type TopBarProps = {
  onMenuClick?: () => void;
};

function TopBar({ onMenuClick }: TopBarProps) {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    let mounted = true;

    async function carregarUsuario() {
      try {
        const data = await getCurrentUser();

        if (mounted) {
          setUser(data);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    }

    carregarUsuario();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function handleLogout() {
    logout();
    setIsUserMenuOpen(false);
    navigate("/login", { replace: true });
  }

  function handleProfile() {
    setIsUserMenuOpen(false);
    navigate("/perfil");
  }

  const fullName = user
    ? `${user.nome} ${user.sobrenome}`.trim()
    : "Carregando...";

  const initials = user
    ? `${user.nome?.[0] ?? ""}${user.sobrenome?.[0] ?? ""}`.toUpperCase()
    : "--";

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <button
          className="top-bar-menu-button"
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menu lateral"
        >
          ☰
        </button>

        <form
          className="top-bar-search"
          role="search"
          aria-label="Buscar no sistema"
          onSubmit={(event) => event.preventDefault()}
        >
          <span className="search-icon" aria-hidden="true">
            ⌕
          </span>

          <input
            type="search"
            name="search"
            placeholder="Buscar movimentações..."
            aria-label="Buscar movimentações"
          />

          <kbd>⌘ K</kbd>
        </form>
      </div>

      <div className="top-bar-actions">
        <label className="period-selector">
          <span className="sr-only">Período financeiro</span>

          <span aria-hidden="true">◷</span>

          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            aria-label="Selecionar período financeiro"
          >
            <option value="month">Este mês</option>
            <option value="previous">Mês anterior</option>
            <option value="year">Este ano</option>
          </select>
        </label>

        <button
          className="notification-button"
          type="button"
          aria-label="Notificações"
        >
          ♢
          <span className="notification-dot" />
        </button>

        <div className="user-menu-wrapper" ref={menuRef}>
          <button
            className="user-menu-trigger"
            type="button"
            aria-label={`Abrir menu de ${fullName}`}
            aria-expanded={isUserMenuOpen}
            aria-controls="user-menu"
            onClick={() => setIsUserMenuOpen((current) => !current)}
          >
            <span className="user-avatar">{initials}</span>

            <span className="user-summary">
              <strong>{fullName}</strong>
              <small>Conta pessoal</small>
            </span>

            <span
              className={`user-chevron ${
                isUserMenuOpen ? "user-chevron-open" : ""
              }`}
              aria-hidden="true"
            >
              ˅
            </span>
          </button>

          {isUserMenuOpen && (
            <div
              id="user-menu"
              className="user-menu"
              aria-label="Opções da conta"
            >
              <button type="button" onClick={handleProfile}>
                <span aria-hidden="true">◎</span>
                Meu perfil
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  navigate("/configuracoes");
                }}
              >
                <span aria-hidden="true">⚙</span>
                Configurações
              </button>

              <div className="user-menu-divider" />

              <button
                className="logout-button"
                type="button"
                onClick={handleLogout}
              >
                <span aria-hidden="true">↪</span>
                Sair da conta
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;