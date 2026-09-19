import { useEffect, useMemo, useState } from "react";

import type {
  Conta, CreateAccountData,
} from "../../services/accountService";

import {
  getAccounts, createAccount, updateAccount, toggleAccount,
} from "../../services/accountService";

import ContaForm from "../../components/contas/contaForm/ContaForm";

import ContasTable from "../../components/contas/contasTable/ContasTable";

import "./contas.css";

function formatCurrency(value: string | number): string {
  const numericValue = Number(value) || 0;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
}

function Contas() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [contaEditando, setContaEditando] = useState<Conta | null>(null);

  useEffect(() => {
    let ignore = false;

    async function carregarContas() {
      try {
        setLoading(true);
        setError("");

        const data = await getAccounts();

        if (!ignore) {
          setContas(data.results);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setError(
            "Não foi possível carregar suas contas.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    carregarContas();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleSaveAccount(
    data: CreateAccountData
  ) {
    if (contaEditando) {
      const contaAtualizada = await updateAccount(
        contaEditando.id,
        data
      );

      setContas((contasAtuais) =>
        contasAtuais.map((contaAtual) =>
          contaAtual.id === contaAtualizada.id
            ? contaAtualizada
            : contaAtual
        )
      );
    } else {
      const novaConta = await createAccount(data);

      setContas((contasAtuais) => [
        ...contasAtuais,
        novaConta,
      ]);
    }
    setContaEditando(null);
    setMostrarFormulario(false);
  }

  function handleEditAccount(conta: Conta) {
    setContaEditando(conta);
    setMostrarFormulario(true);
  }

  async function handleToggleStatus(conta: Conta) {
    try {
      const contaAtualizada = await toggleAccount(
        conta.id,
        !conta.ativo
      );

      setContas((contasAtuais) =>
        contasAtuais.map((contaAtual) =>
          contaAtual.id === contaAtualizada.id
            ? contaAtualizada
            : contaAtual
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        "Não foi possível alterar o status da conta."
      );
    }
  }  

  const saldoTotal = useMemo(() => {
    return contas.reduce((total, conta) => {
      return total + Number(conta.saldo_atual ?? 0);
    }, 0);
  }, [contas]);

  if (loading) {
    return (
      <div className="contas-state" role="status">
        <div className="contas-loader" />
        <p>Carregando suas contas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="contas-state contas-state-error"
        role="alert"
      >
        <span className="contas-state-icon">!</span>

        <h2>Não foi possível carregar as contas</h2>

        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="contas">
      <header className="contas-header">
        <div>
          <p className="contas-eyebrow">
            ORGANIZAÇÃO FINANCEIRA
          </p>

          <h1>Contas</h1>

          <p className="contas-description">
            Gerencie suas contas e acompanhe seus saldos.
          </p>
        </div>

        <button
          type="button"
          className="contas-add-button"
          onClick={() => {
            setContaEditando(null);
            setMostrarFormulario(true);
          }}
        >
          <span aria-hidden="true">+</span>
          Nova conta
        </button>
      </header>
      {mostrarFormulario && (
        <ContaForm
          conta={contaEditando}
          onSubmit={handleSaveAccount}
          onCancel={() => {
            setContaEditando(null);
            setMostrarFormulario(false);
          }}
        />
      )}
      
      <section
        className="contas-summary"
        aria-label="Resumo das contas"
      >
        <article className="contas-summary-card contas-summary-main">
          <span className="contas-summary-label">
            Saldo total
          </span>

          <strong className="contas-summary-value">
            {formatCurrency(saldoTotal)}
          </strong>

          <span className="contas-summary-caption">
            Saldo consolidado das contas
          </span>
        </article>

        <article className="contas-summary-card">
          <span className="contas-summary-label">
            Total de contas
          </span>

          <strong className="contas-summary-value">
            {contas.length}
          </strong>

          <span className="contas-summary-caption">
            contas cadastradas
          </span>
        </article>
      </section>

      <section className="contas-list">
        <div className="contas-list-header">
          <div>
            <p className="contas-list-eyebrow">
              VISÃO GERAL
            </p>

            <h2>Minhas contas</h2>
          </div>

          <span className="contas-list-count">
            {contas.length}{" "}
            {contas.length === 1 ? "registro" : "registros"}
          </span>
        </div>

        {contas.length === 0 ? (
          <div className="contas-empty" role="status">
            <span className="contas-state-icon">∅</span>

            <h3>Nenhuma conta cadastrada</h3>

            <p>
              Cadastre sua primeira conta para começar a
              acompanhar seus saldos.
            </p>

            <button
              type="button"
              className="contas-empty-button"
              onClick={() => setMostrarFormulario(true)}
            >
              Criar primeira conta
            </button>
          </div>
        ) : (
          <ContasTable
            contas={contas}
            onEdit={handleEditAccount}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </section>
    </div>
  );
}

export default Contas;