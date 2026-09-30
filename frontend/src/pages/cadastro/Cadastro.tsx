import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createUsuario } from "../../services/usuarioService";

import "./cadastro.css";

function Cadastro() {
  const navigate = useNavigate();
  const redirectTimer = useRef<number | null>(null);

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [timezone, setTimezone] = useState(
    "America/Sao_Paulo",
  );

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    return () => {
      if (redirectTimer.current !== null) {
        window.clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  function limparMensagens() {
    setErro("");
    setSucesso("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    limparMensagens();

    const nomeNormalizado = nome.trim();
    const sobrenomeNormalizado = sobrenome.trim();
    const emailNormalizado = email.trim().toLowerCase();

    if (!nomeNormalizado || !sobrenomeNormalizado) {
      setErro("Informe seu nome e sobrenome.");
      return;
    }

    if (senha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não conferem.");
      return;
    }

    try {
      setCarregando(true);

      await createUsuario({
        nome: nomeNormalizado,
        sobrenome: sobrenomeNormalizado,
        email: emailNormalizado,
        senha,
        confirmar_senha: confirmarSenha,
        timezone,
      });

      setSucesso(
        "Usuário criado com sucesso! Você já pode fazer login.",
      );

      redirectTimer.current = window.setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);

      setErro(
        "Não foi possível criar o usuário. Verifique os dados e tente novamente.",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="cadastro-page">
      <div className="cadastro-background-glow cadastro-glow-one" />
      <div className="cadastro-background-glow cadastro-glow-two" />
      <div className="cadastro-grid" />

      <section className="cadastro-card">
        <header className="cadastro-header">
          <div className="cadastro-brand">
            <span className="cadastro-logo">S</span>

            <span className="cadastro-brand-name">
              SANTIFI
            </span>
          </div>

          <p className="cadastro-eyebrow">
            NOVO COMEÇO FINANCEIRO
          </p>

          <h1>Criar sua conta</h1>

          <p className="cadastro-description">
            Cadastre-se para começar a organizar sua vida
            financeira com clareza e controle.
          </p>
        </header>

        <form
          className="cadastro-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="cadastro-row">
            <div className="cadastro-field">
              <label htmlFor="nome">
                Nome
                <span aria-hidden="true">*</span>
              </label>

              <input
                id="nome"
                name="nome"
                type="text"
                value={nome}
                onChange={(event) => {
                  setNome(event.target.value);
                  limparMensagens();
                }}
                placeholder="Seu nome"
                autoComplete="given-name"
                maxLength={80}
                required
              />
            </div>

            <div className="cadastro-field">
              <label htmlFor="sobrenome">
                Sobrenome
                <span aria-hidden="true">*</span>
              </label>

              <input
                id="sobrenome"
                name="sobrenome"
                type="text"
                value={sobrenome}
                onChange={(event) => {
                  setSobrenome(event.target.value);
                  limparMensagens();
                }}
                placeholder="Seu sobrenome"
                autoComplete="family-name"
                maxLength={80}
                required
              />
            </div>
          </div>

          <div className="cadastro-field">
            <label htmlFor="email">
              E-mail
              <span aria-hidden="true">*</span>
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                limparMensagens();
              }}
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="cadastro-row">
            <div className="cadastro-field">
              <label htmlFor="senha">
                Senha
                <span aria-hidden="true">*</span>
              </label>

              <input
                id="senha"
                name="senha"
                type="password"
                value={senha}
                onChange={(event) => {
                  setSenha(event.target.value);
                  limparMensagens();
                }}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                minLength={8}
                required
              />

              <small className="cadastro-hint">
                Use pelo menos 8 caracteres.
              </small>
            </div>

            <div className="cadastro-field">
              <label htmlFor="confirmar-senha">
                Confirmar senha
                <span aria-hidden="true">*</span>
              </label>

              <input
                id="confirmar-senha"
                name="confirmar_senha"
                type="password"
                value={confirmarSenha}
                onChange={(event) => {
                  setConfirmarSenha(event.target.value);
                  limparMensagens();
                }}
                placeholder="Repita sua senha"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
          </div>

          <div className="cadastro-field">
            <label htmlFor="timezone">
              Fuso horário
              <span aria-hidden="true">*</span>
            </label>

            <select
              id="timezone"
              name="timezone"
              value={timezone}
              onChange={(event) =>
                setTimezone(event.target.value)
              }
              required
            >
              <option value="America/Sao_Paulo">
                São Paulo
              </option>

              <option value="America/Manaus">
                Manaus
              </option>

              <option value="America/Belem">
                Belém
              </option>

              <option value="America/Fortaleza">
                Fortaleza
              </option>

              <option value="America/Recife">
                Recife
              </option>
            </select>
          </div>

          {erro && (
            <div
              className="cadastro-message cadastro-error"
              role="alert"
            >
              <span aria-hidden="true">!</span>
              {erro}
            </div>
          )}

          {sucesso && (
            <div
              className="cadastro-message cadastro-success"
              role="status"
            >
              <span aria-hidden="true">✓</span>
              {sucesso}
            </div>
          )}

          <button
            type="submit"
            className="cadastro-submit"
            disabled={carregando}
          >
            {carregando ? (
              <>
                <span
                  className="cadastro-spinner"
                  aria-hidden="true"
                />
                Criando conta...
              </>
            ) : (
              "Criar conta"
            )}
          </button>
        </form>

        <footer className="cadastro-footer">
          <span>Já possui uma conta?</span>

          <Link to="/login">Entrar</Link>
        </footer>

        <div className="cadastro-signature">
          <span className="cadastro-signature-line" />

          <span>Secure access · © 2026 SANTIFI</span>
        </div>
      </section>
    </main>
  );
}

export default Cadastro;