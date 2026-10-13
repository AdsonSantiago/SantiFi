
import { useEffect, useState } from "react";

import {
  getCurrentUser,
  updateCurrentUser,
  type CurrentUser,
} from "../../services/authService";

import "./configuracoes.css";

function Configuracoes() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    async function carregarUsuario() {
      try {
        setLoading(true);
        setError("");

        const data = await getCurrentUser();

        if (mounted) {
          setUser(data);
          setNome(data.nome ?? "");
          setSobrenome(data.sobrenome ?? "");
          setEmail(data.email ?? "");
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);

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

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSuccess("");

    const dados = {
      nome: nome.trim(),
      sobrenome: sobrenome.trim(),
      email: email.trim(),
    };

    if (
      !dados.nome ||
      !dados.sobrenome ||
      !dados.email
    ) {
      setError("Preencha todos os campos.");
      return;
    }

    setSaving(true);

    try {
      const usuarioAtualizado = await updateCurrentUser(dados);

      setUser(usuarioAtualizado);
      setNome(usuarioAtualizado.nome);
      setSobrenome(usuarioAtualizado.sobrenome);
      setEmail(usuarioAtualizado.email);
      setSuccess("Dados da conta atualizados com sucesso.");
    } catch (error: unknown) {
      console.error("Erro ao atualizar usuário:", error);

      const resposta = (
        error as {
          response?: {
            data?: {
              email?: string[];
              nome?: string[];
              sobrenome?: string[];
              detail?: string;
              message?: string;
            };
          };
        }
      ).response?.data;

      const mensagem =
        resposta?.email?.[0] ??
        resposta?.nome?.[0] ??
        resposta?.sobrenome?.[0] ??
        resposta?.detail ??
        resposta?.message ??
        "Não foi possível salvar as alterações. Verifique os dados e tente novamente.";

      setError(mensagem);
    } finally {
      setSaving(false);
    }
  }

  const fullName = user
    ? `${user.nome ?? ""} ${user.sobrenome ?? ""}`.trim()
    : "";

  const initials = user
    ? `${user.nome?.[0] ?? ""}${user.sobrenome?.[0] ?? ""}`.toUpperCase()
    : "--";

  if (loading) {
    return (
      <div className="configuracoes-page">
        <div className="configuracoes-loading" role="status">
          <span className="configuracoes-loader" />
          <p>Carregando informações da conta...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="configuracoes-page">
        <div className="configuracoes-error" role="alert">
          {error || "Não foi possível carregar os dados da conta."}
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
            Atualize suas informações pessoais.
          </p>
        </div>

        <div className="configuracoes-card configuracoes-profile-card">
          <div className="configuracoes-avatar" aria-hidden="true">
            {initials}
          </div>

          <div className="configuracoes-user-info">
            <strong>{fullName}</strong>
            <span>{user.email}</span>
          </div>
        </div>

        <form
          className="configuracoes-card configuracoes-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="configuracoes-field">
            <label htmlFor="config-nome">Nome</label>

            <input
              id="config-nome"
              type="text"
              value={nome}
              onChange={(event) => { setNome(event.target.value);
                  setError("");
                  setSuccess("");
              }}
              autoComplete="given-name"
              maxLength={150}
              required
            />
          </div>

          <div className="configuracoes-field">
            <label htmlFor="config-sobrenome">Sobrenome</label>

            <input
              id="config-sobrenome"
              type="text"
              value={sobrenome}
              onChange={(event) => { setSobrenome(event.target.value);
                setError("");
                setSuccess("");
              }}
              autoComplete="family-name"
              maxLength={150}
              required
            />
          </div>

          <div className="configuracoes-field">
            <label htmlFor="config-email">E-mail</label>

            <input
              id="config-email"
              type="email"
              value={email}
              onChange={(event) => { setEmail(event.target.value);
                setError("");
                setSuccess("");
              }}
              autoComplete="email"
              maxLength={254}
              required
            />
          </div>

          {error && (
            <p className="configuracoes-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="configuracoes-success" role="status">
              {success}
            </p>
          )}

          <div className="configuracoes-form-actions">
            <button
              type="button"
              className="configuracoes-cancel-button"
              disabled={saving}
              onClick={() => {
                setNome(user.nome);
                setSobrenome(user.sobrenome);
                setEmail(user.email);
                setError("");
                setSuccess("");
              }}
            >
              Restaurar dados
            </button>

            <button
              type="submit"
              className="configuracoes-option-button"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span
                    className="configuracoes-submit-spinner"
                    aria-hidden="true"
                  />
                  Salvando...
                </>
              ) : (
                "Salvar alterações"
              )}
            </button>
          </div>
        </form>
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
