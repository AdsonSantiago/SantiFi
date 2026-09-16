import type { Conta } from "../../services/accountService";

import { formatCurrency } from "../../utils/formatCurrency";

import "./contasTable.css";

interface ContasTableProps {
  contas: Conta[];
}

function getTipoLabel(tipo: string): string {
  const tipos: Record<string, string> = {
    BANCO: "Banco",
    CARTAO: "Cartão",
    DINHEIRO: "Dinheiro",
    INVESTIMENTO: "Investimento",
  };

  return tipos[tipo] ?? tipo;
}

function ContasTable({
  contas,
}: ContasTableProps) {
  if (contas.length === 0) {
    return (
      <div className="contas-table-empty" role="status">
        <span className="contas-table-empty-icon">
          ∅
        </span>

        <h3>Nenhuma conta encontrada</h3>

        <p>
          Cadastre sua primeira conta para começar a
          acompanhar seus saldos.
        </p>
      </div>
    );
  }

  return (
    <div className="contas-table-wrapper">
      <table className="contas-table">
        <caption className="sr-only">
          Lista de contas financeiras
        </caption>

        <thead>
          <tr>
            <th scope="col">Conta</th>
            <th scope="col">Tipo</th>
            <th scope="col">Saldo inicial</th>
            <th scope="col">Saldo atual</th>
            <th scope="col">Status</th>
          </tr>
        </thead>

        <tbody>
          {contas.map((conta) => {
            const saldoInicial = Number(
              conta.saldo_inicial,
            ) || 0;

            const saldoAtual = Number(
              conta.saldo_atual,
            ) || 0;

            const tipoClasse = conta.tipo
              .toLowerCase()
              .replace(/\s+/g, "-");

            return (
              <tr key={conta.id}>
                <th
                  scope="row"
                  data-label="Conta"
                  className="conta-name-cell"
                >
                  <strong>{conta.nome}</strong>
                </th>

                <td data-label="Tipo">
                  <span
                    className={`conta-type conta-type-${tipoClasse}`}
                  >
                    {getTipoLabel(conta.tipo)}
                  </span>
                </td>

                <td data-label="Saldo inicial">
                  {formatCurrency(saldoInicial)}
                </td>

                <td
                  data-label="Saldo atual"
                  className={
                    saldoAtual >= 0
                      ? "conta-balance-positive"
                      : "conta-balance-negative"
                  }
                >
                  {formatCurrency(saldoAtual)}
                </td>

                <td data-label="Status">
                  <span
                    className={`conta-status ${
                      conta.ativo
                        ? "ativo"
                        : "inativo"
                    }`}
                  >
                    <i aria-hidden="true" />
                    {conta.ativo ? "Ativa" : "Inativa"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ContasTable;