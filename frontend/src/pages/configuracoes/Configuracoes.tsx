import { useEffect, useState } from "react";

import {
  getCurrentUser,
  type CurrentUser,
} from "../../services/authService";

import "./configuracoes.css";

function Configuracoes() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function carregarUsuario() {
      try {
        setLoading(true);
        setError("");

        const data = await getCurrentUser();

        if (mounted) {
          setUser(data);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar usuário:",
          error,
        );

        if (mounted) {
          setError(
            "Não foi possível carregar os dados da conta.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    carregarUsuario();

    return () => {
      mounted = false;
    };
  }, []);

  const fullName = user
    ? `${user.nome ?? ""} ${
        user.sobrenome ?? ""
      }`.trim()
    : "";

  const initials = user
    ? `${user.nome?.[0] ?? ""}${
        user.sobrenome?.[0] ?? ""
      }`.toUpperCase()
    : "--";

  if (loading) {
    return (
      <div className="configuracoes-page">
        <div
          className="configuracoes-loading"
          role="status"
        >
          <span className="configuracoes-loader" />
          <p>Carregando informações da conta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="configuracoes-page">
        <div
          className="configuracoes-error"
          role="alert"
        >
          <span aria-hidden="true">!</span>
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="configuracoes-page">
        <div
          className="configuracoes-empty"
          role="status"
        >
          <span
            className="configuracoes-state-icon"
            aria-hidden="true"
          >
            ∅
          </span>

          <h2>Usuário não encontrado</h2>

          <p>
            Não foi possível encontrar os dados da sua conta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="configuracoes-page">
      <header className="configuracoes-header">
        <div>
          <p className="configuracoes-eyebrow">
            PREFERÊNCIAS
          </p>

          <h1>Configurações</h1>

          <p className="configuracoes-description">
            Gerencie sua conta e as preferências do SantiFi.
          </p>
        </div>
      </header>

      <section
        className="configuracoes-section"
        aria-labelledby="conta-title"
      >
        <div className="configuracoes-section-header">
          <h2 id="conta-title">Minha conta</h2>

          <p>
            Gerencie suas informações pessoais.
          </p>
        </div>

        <div className="configuracoes-card configuracoes-profile-card">
          <div
            className="configuracoes-avatar"
            aria-hidden="true"
          >
            {initials}
          </div>

          <div className="configuracoes-user-info">
            <strong>{fullName}</strong>
            <span>{user.email}</span>
          </div>
        </div>
      </section>

      <section
        className="configuracoes-section"
        aria-labelledby="seguranca-title"
      >
        <div className="configuracoes-section-header">
          <h2 id="seguranca-title">Segurança</h2>

          <p>
            Gerencie o acesso e a segurança da sua conta.
          </p>
        </div>

        <div className="configuracoes-card configuracoes-option">
          <div>
            <strong>Senha</strong>

            <span>
              Altere sua senha de acesso ao SantiFi.
            </span>
          </div>

          <button
            type="button"
            className="configuracoes-option-button"
          >
            Alterar senha
          </button>
        </div>

        <div className="configuracoes-card configuracoes-option">
          <div>
            <strong>Google</strong>

            <span>
              Gerencie o acesso da sua conta pelo Google.
            </span>
          </div>

          <span className="configuracoes-status">
            Não configurado
          </span>
        </div>
      </section>

      <section
        className="configuracoes-section"
        aria-labelledby="preferencias-title"
      >
        <div className="configuracoes-section-header">
          <h2 id="preferencias-title">Preferências</h2>

          <p>
            Personalize sua experiência no SantiFi.
          </p>
        </div>

        <div className="configuracoes-card configuracoes-option">
          <div>
            <strong>Tema</strong>

            <span>
              Escolha como o SantiFi deve ser exibido.
            </span>
          </div>

          <span className="configuracoes-value">
            Sistema
          </span>
        </div>

        <div className="configuracoes-card configuracoes-option">
          <div>
            <strong>Moeda</strong>

            <span>
              Moeda utilizada nos valores financeiros.
            </span>
          </div>

          <span className="configuracoes-value">
            Real brasileiro (R$)
          </span>
        </div>
      </section>
    </div>
  );
}

export default Configuracoes;