import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const googleButtonRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login/", {
        email,
        password,
      });

      const { access, refresh } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(error);
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!window.google || !googleButtonRef.current) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,

      callback: async (response) => {
        setError("");
        setGoogleLoading(true);

        try {
          const result = await api.post("/auth/google/", {
            credential: response.credential,
          });

          const { access, refresh } = result.data;

          localStorage.setItem("access_token", access);
          localStorage.setItem("refresh_token", refresh);

          navigate("/dashboard", { replace: true });
        } catch (error) {
          console.error(error);
          setError("Não foi possível entrar com o Google.");
        } finally {
          setGoogleLoading(false);
        }
      },
    });

    window.google.accounts.id.renderButton(
      googleButtonRef.current,
      {
        // type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: Math.min( 360,
        googleButtonRef.current.clientWidth)
      }
    );
  }, [navigate]);

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="visual-orb orb-blue" />
        <div className="visual-orb orb-purple" />
        <div className="visual-grid" />

        <div className="visual-header">
          <div className="brand">
            <span className="brand-icon">S</span>
            <span>SantiFi</span>
          </div>

          <span className="system-status">
            <span />
            SISTEMA ONLINE
          </span>
        </div>

        <div className="visual-content">
          <p className="eyebrow">
            CONTROLE INTELIGENTE
          </p>

          <h1 aria-label="Seu dinheiro. Sua evolução.">
            <span className="headline-line headline-line-one">
              Seu dinheiro<span className="headline-dot">.</span>
            </span>

            <span className="headline-line headline-line-two">
              Sua evolução<span className="headline-dot">.</span>
            </span>
          </h1>

          <p className="visual-description">
            Uma nova forma de acompanhar sua vida financeira com clareza,
            inteligência e controle.
          </p>
        </div>

        <div className="visual-signature">
          <div className="signature-line" aria-hidden="true" />

          <div className="signature-content">
            <span className="signature-monogram" aria-hidden="true">
              AS
            </span>

            <div>
              <span className="signature-label">CRIADO POR</span>
              <strong>Adson Santiago</strong>
            </div>
          </div>

          <span className="signature-year">
            © 2026 · Financeiro
          </span>
        </div>

        <div className="visual-footer">
          <span>SECURE ACCESS</span>
          <span>v1.0.0</span>
        </div>
      </section>

      <section className="login-container">
        <div className="login-card">
          <div className="mobile-brand">
            <span className="brand-icon">S</span>
            <span>SantiFi</span>
          </div>

          <div className="login-heading">
            <p className="eyebrow">ACESSO SEGURO</p>

            <h2>Bem-vindo de volta</h2>

            <p>
              Entre na sua conta para continuar acompanhando suas finanças.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-field">
              <label htmlFor="email">E-mail</label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@exemplo.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-field">
              <div className="password-header">
                <label htmlFor="password">Senha</label>

                <a href="/forgot-password">Esqueceu a senha?</a>
              </div>

              <div className="password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Autenticando..." : "Entrar"}
              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="divider">
            <span>ou continue com</span>
          </div>

          <div
            ref={googleButtonRef}
            className="google-button-container"
            aria-label="Entrar com o Google"
          />

          {googleLoading && (
            <p className="google-loading" role="status">
              Autenticando com Google...
            </p>
          )}

          <p className="register-text">
            Ainda não possui uma conta?{" "}
            <a href="/cadastro">Criar conta</a>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;