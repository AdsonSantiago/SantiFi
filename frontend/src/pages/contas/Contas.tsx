import { useEffect, useMemo, useState } from "react";

import "./contas.css";

type Conta = {
  id: number;
  nome: string;
  tipo: "BANCO" | "CARTAO" | "DINHEIRO" | "INVESTIMENTO";
  numero?: string;
  saldo: string;
  status: "ATIVA" | "INATIVA" | "PENDENTE";
  ultima_movimentacao?: string;
};

function formatCurrency(value: string | number): string {
  const numericValue = Number(value) || 0;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
}

function formatDate(date?: string): string {
  if (!date) return "-";

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) return date;

  return `${day}/${month}/${year}`;
}

function Contas() {
  const [contas, setContas] = useState<Conta[]>([
    {
      id: 1,
      nome: "Conta Corrente",
      tipo: "BANCO",
      numero: "**** 1024",
      saldo: "8420.55",
      status: "ATIVA",
      ultima_movimentacao: "2026-08-29",
    },
    {
      id: 2,
      nome: "Cartão principal",
      tipo: "CARTAO",
      numero: "**** 4431",
      saldo: "-1260.90",
      status: "PENDENTE",
      ultima_movimentacao: "2026-08-30",
    },
    {
      id: 3,
      nome: "Caixa",
      tipo: "DINHEIRO",
      numero: "Físico",
      saldo: "350.00",
      status: "ATIVA",
      ultima_movimentacao: "2026-08-28",
    },
  ]);

  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");

  const saldoTotal = useMemo(
    () =>
      contas.reduce(
        (acc, conta) => acc + Number(conta.saldo || 0),
        0,
      ),
    [contas],
  );

  const contasFiltradas = useMemo(() => {
    const texto = busca.trim().toLowerCase();

    return contas.filter((conta) => {
      const matchesBusca =
        texto === "" ||
        conta.nome.toLowerCase().includes(texto) ||
        conta.numero?.toLowerCase().includes(texto) ||
        conta.tipo.toLowerCase().includes(texto);

      const matchesTipo =
        tipoFiltro === "" || conta.tipo === tipoFiltro;

      return matchesBusca && matchesTipo;
    });
  }, [busca, tipoFiltro, contas]);

  return (
    <div className="contas">
      <section className="contas-header">
        <div>
          <p className="contas-eyebrow">CONTROLE FINANCEIRO</p>
          <h1>Contas</h1>
          <p>
            Acompanhe suas contas bancárias, cartões e caixa.
          </p>
        </div>

        <button type="button" className="contas-button">
          + Nova conta
        </button>
      </section>

      <section className="contas-summary">
        <article className="contas-card contas-card-main">
          <span className="contas-card-label">Saldo total</span>
          <strong className="contas-card-value">
            {formatCurrency(saldoTotal)}
          </strong>
          <span className="contas-card-caption">
            Soma de todas as contas cadastradas
          </span>
        </article>

        <article className="contas-card">
          <span className="contas-card-label">Contas ativas</span>
          <strong className="contas-card-value">
            {contas.filter((c) => c.status === "ATIVA").length}
          </strong>
          <span className="contas-card-caption">
            disponíveis para uso
          </span>
        </article>

        <article className="contas-card">
          <span className="contas-card-label">Pendências</span>
          <strong className="contas-card-value">
            {contas.filter((c) => c.status === "PENDENTE").length}
          </strong>
          <span className="contas-card-caption">
            contas que exigem atenção
          </span>
        </article>

        <article className="contas-card">
          <span className="contas-card-label">Tipos</span>
          <strong className="contas-card-value">
            {new Set(contas.map((c) => c.tipo)).size}
          </strong>
          <span className="contas-card-caption">
            categorias de contas
          </span>
        </article>
      </section>

      <section className="contas-filtros" aria-label="Filtros de contas">
        <label className="contas-field">
          <span>Buscar</span>
          <input
            type="text"
            placeholder="Buscar conta..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </label>

        <label className="contas-field">
          <span>Tipo</span>
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
          >
            <option value="">Todos os tipos</option>
            <option value="BANCO">Banco</option>
            <option value="CARTAO">Cartão</option>
            <option value="DINHEIRO">Dinheiro</option>
            <option value="INVESTIMENTO">Investimento</option>
          </select>
        </label>
      </section>

      <section className="contas-table-card">
        <div className="contas-table-header">
          <h2>Lista de contas</h2>
          <span>{contasFiltradas.length} registros</span>
        </div>

        <div className="contas-table-wrap">
          <table className="contas-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Número</th>
                <th>Status</th>
                <th>Saldo</th>
                <th>Última movimentação</th>
              </tr>
            </thead>

            <tbody>
              {contasFiltradas.map((conta) => (
                <tr key={conta.id}>
                  <td data-label="Nome">{conta.nome}</td>
                  <td data-label="Tipo">
                    <span className={`conta-badge tipo-${conta.tipo.toLowerCase()}`}>
                      {conta.tipo}
                    </span>
                  </td>
                  <td data-label="Número">{conta.numero ?? "-"}</td>
                  <td data-label="Status">
                    <span className={`conta-status status-${conta.status.toLowerCase()}`}>
                      {conta.status}
                    </span>
                  </td>
                  <td data-label="Saldo" className="saldo-cell">
                    {formatCurrency(conta.saldo)}
                  </td>
                  <td data-label="Última movimentação">
                    {formatDate(conta.ultima_movimentacao)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Contas;
