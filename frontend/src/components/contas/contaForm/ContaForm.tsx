import { useState } from "react";

import type {
  CreateAccountData,
} from "../../../services/accountService";

import "./contaForm.css";

interface ContaFormProps {
  onSubmit: (data: CreateAccountData) => Promise<void>;
  onCancel: () => void;
}

function ContaForm({
  onSubmit,
  onCancel,
}: ContaFormProps) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("CC");
  const [saldoInicial, setSaldoInicial] = useState("");
  const [ordem, setOrdem] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nomeNormalizado = nome.trim();
    const saldo = Number(saldoInicial);
    const ordemNormalizada = Number(ordem);

    if (!nomeNormalizado) {
      setError("Informe o nome da conta.");
      return;
    }

    if (nomeNormalizado.length < 2) {
      setError("O nome da conta deve ter pelo menos 2 caracteres.");
      return;
    }

    if (
      saldoInicial.trim() === "" ||
      Number.isNaN(saldo) ||
      saldo < 0
    ) {
      setError("Informe um saldo inicial válido.");
      return;
    }

    if (
      !Number.isInteger(ordemNormalizada) ||
      ordemNormalizada < 1
    ) {
      setError("A ordem deve ser um número inteiro maior que zero.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await onSubmit({
        nome: nomeNormalizado,
        tipo,
        saldo_inicial: saldoInicial,
        ordem: ordemNormalizada,
        ativo: true,
      });
    } catch (error) {
      console.error(error);
      setError("Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="conta-form-container"
      role="presentation"
    >
      <div
        className="conta-form-backdrop"
        onClick={loading ? undefined : onCancel}
        aria-hidden="true"
      />

      <form
        className="conta-form"
        onSubmit={handleSubmit}
        aria-labelledby="conta-form-title"
        noValidate
      >
        <div className="conta-form-header">
          <div>
            <p className="conta-form-eyebrow">
              ORGANIZAÇÃO FINANCEIRA
            </p>

            <h2 id="conta-form-title">Nova conta</h2>

            <p className="conta-form-description">
              Cadastre uma conta para acompanhar seu saldo.
            </p>
          </div>

          <button
            type="button"
            className="conta-form-close"
            onClick={onCancel}
            disabled={loading}
            aria-label="Fechar formulário"
          >
            ×
          </button>
        </div>

        {error && (
          <div
            id="conta-form-error"
            className="conta-form-error"
            role="alert"
          >
            <span aria-hidden="true">!</span>
            {error}
          </div>
        )}

        <fieldset disabled={loading} className="conta-form-fields">
          <div className="conta-form-field">
            <label htmlFor="nome">
              Nome da conta
              <span aria-hidden="true">*</span>
            </label>

            <input
              id="nome"
              name="nome"
              type="text"
              value={nome}
              onChange={(event) => {
                setNome(event.target.value);
                setError("");
              }}
              placeholder="Ex.: Nubank"
              autoComplete="off"
              maxLength={80}
              required
              aria-required="true"
              aria-invalid={Boolean(error && !nome.trim())}
            />
          </div>

          <div className="conta-form-field">
            <label htmlFor="tipo">
              Tipo de conta
              <span aria-hidden="true">*</span>
            </label>

            <select
              id="tipo"
              name="tipo"
              value={tipo}
              onChange={(event) => {
                setTipo(event.target.value);
                setError("");
              }}
              required
              aria-required="true"
            >
              <option value="CC">Conta corrente</option>
              <option value="CP">Poupança</option>
              <option value="CAR">Carteira</option>
              <option value="CRT">Cartão</option>
            </select>
          </div>

          <div className="conta-form-row">
            <div className="conta-form-field">
              <label htmlFor="saldo-inicial">
                Saldo inicial
                <span aria-hidden="true">*</span>
              </label>

              <div className="conta-input-prefix">
                <span aria-hidden="true">R$</span>

                <input
                  id="saldo-inicial"
                  name="saldo_inicial"
                  type="number"
                  step="0.01"
                  min="0"
                  value={saldoInicial}
                  onChange={(event) => {
                    setSaldoInicial(event.target.value);
                    setError("");
                  }}
                  placeholder="0,00"
                  inputMode="decimal"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(
                    error &&
                      (!saldoInicial ||
                        Number(saldoInicial) < 0),
                  )}
                />
              </div>
            </div>

            <div className="conta-form-field">
              <label htmlFor="ordem">
                Ordem de exibição
                <span aria-hidden="true">*</span>
              </label>

              <input
                id="ordem"
                name="ordem"
                type="number"
                min="1"
                step="1"
                value={ordem}
                onChange={(event) => {
                  setOrdem(Number(event.target.value));
                  setError("");
                }}
                required
                aria-required="true"
              />
            </div>
          </div>
        </fieldset>

        <div className="conta-form-actions">
          <button
            type="button"
            className="conta-form-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="conta-form-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="conta-form-spinner"
                  aria-hidden="true"
                />
                Salvando...
              </>
            ) : (
              "Criar conta"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContaForm;