import { useNavigate } from "react-router-dom";
import "./recentMovements-style.css";

import type { Movimento } from "../../../services/movementService";
import { formatCurrency } from "../../../utils/formatCurrency";

function formatDate(date: string): string {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
        "pt-BR"
    );
}

function getMovementType(tipo: Movimento["tipo"]): string {

    switch (tipo) {

        case "REC":
            return "Receita";

        case "DES":
            return "Despesa";

        case "TRA":
            return "Transferência";

        default:
            return tipo;
    }
}

function RecentMovements({ movements }: { movements: Movimento[] }) {
    const navigate = useNavigate();


    return (
        <section className="dashboard-card">

            <div className="card-header">

                <h2>
                    Últimos lançamentos
                </h2>

                <button type="button" onClick={() => navigate("/movimentos")}>
                    Ver todos
                </button>

            </div>


            <table className="movements-table">

                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Tipo</th>
                        <th>Valor</th>
                        <th>Data</th>
                    </tr>
                </thead>


                <tbody>
                    {movements.length === 0 && (
                        <tr><td colSpan={4}>Nenhum lançamento neste período.</td></tr>
                    )}
                    {movements.map((movement) => (

                        <tr key={movement.id}>

                            <td>
                                {movement.descricao}
                            </td>

                            <td>
                                {getMovementType(movement.tipo)}
                            </td>

                            <td
                                className={
                                    movement.tipo === "REC"
                                        ? "movement-income"
                                        : movement.tipo === "DES"
                                            ? "movement-expense"
                                            : ""
                                }
                            >
                                {movement.tipo === "REC" && "+"}
                                {movement.tipo === "DES" && "-"}
                                {formatCurrency(movement.valor)}
                            </td>
                            <td>
                                {formatDate(movement.data_movimento)}
                            </td>
                        </tr>

                    ))}

                </tbody>

            </table>

        </section>
    );
}

export default RecentMovements;
