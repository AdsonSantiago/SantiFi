import type { Movimento } from "../../services/movementService";

import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

import "./movimentosTable.css";

interface MovimentosTableProps {
  movimentos: Movimento[];
  onEdit: (movimento: Movimento) => void;
  onDelete: (movimento: Movimento) => void;
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
  onEdit,
  onDelete,
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
            <th scope="col">Ações</th>
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

              <td
                data-label="Ações"
                className="movimentos-actions-cell"
              >
                <div className="movimentos-table-actions">
                  <button
                    type="button"
                    className="movimento-action-edit"
                    onClick={() => onEdit(movimento)}
                    aria-label={`Editar o movimento ${movimento.descricao}`}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="movimento-action-delete"
                    onClick={() => onDelete(movimento)}
                    aria-label={`Excluir o movimento ${movimento.descricao}`}
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MovimentosTable;