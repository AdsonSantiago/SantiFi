import { useEffect, useState } from "react";
import "./recentMovements-style.css";

import type { Movimento } from "../../../services/movementService";
import { getMovements } from "../../../services/movementService";
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

function RecentMovements() {

    const [movements, setMovements] = useState<Movimento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        async function carregarMovimentos() {

            try {

                const data = await getMovements();

                setMovements(data.results.slice(0, 5));

            } catch (error) {

                console.error(error);

                setError(
                    "Não foi possível carregar os lançamentos."
                );

            } finally {

                setLoading(false);

            }
        }

        carregarMovimentos();

    }, []);


    if (loading) {
        return (
            <section className="dashboard-card">
                <p>Carregando lançamentos...</p>
            </section>
        );
    }


    if (error) {
        return (
            <section className="dashboard-card">
                <p>{error}</p>
            </section>
        );
    }


    return (
        <section className="dashboard-card">

            <div className="card-header">

                <h2>
                    Últimos lançamentos
                </h2>

                <button type="button">
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