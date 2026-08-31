import type { Movimento } from "../../services/movementService";

import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

import "./movimentosTable.css";

interface MovimentosTableProps {
  movimentos: Movimento[];
}

function getTipoLabel(tipo: Movimento["tipo"]) {
  const labels = {
    REC: "Receita",
    DES: "Despesa",
    TRA: "Transferência",
  };

  return labels[tipo];
}

function MovimentosTable({
  movimentos,
}: MovimentosTableProps) {
  return (
    <div className="movimentos-table-wrap">
      <table className="movimentos-table">
        <caption className="sr-only">
          Lista de movimentos financeiros
        </caption>

        <thead>
          <tr>
            <th scope="col">Data</th>
            <th scope="col">Descrição</th>
            <th scope="col">Tipo</th>
            <th scope="col">Valor</th>
          </tr>
        </thead>

        <tbody>
          {movimentos.map((movimento) => (
            <tr key={movimento.id}>
              <td data-label="Data">
                {formatDate(movimento.data_movimento)}
              </td>

              <td data-label="Descrição">
                {movimento.descricao}
              </td>

              <td data-label="Tipo">
                <span
                  className={`movimento-badge movimento-${movimento.tipo.toLowerCase()}`}
                >
                  {getTipoLabel(movimento.tipo)}
                </span>
              </td>

              <td data-label="Valor">
                <span
                  className={`movimento-valor movimento-valor-${movimento.tipo.toLowerCase()}`}
                >
                  {movimento.tipo === "DES" && "- "}
                  {formatCurrency(movimento.valor)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MovimentosTable;
