import { useEffect, useState } from "react";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { Movement } from "../../../services/movementService";
import { getMovements } from "../../../services/movementService";

import { formatCurrency } from "../../../utils/formatCurrency";

import "./evolutionChart.css";
interface EvolutionData {
    data: string;
    receitas: number;
    despesas: number;
}

function formatChartDate(date: string): string {

    const [year, month, day] = date.split("-");

    return `${day}/${month}`;
}

function agruparMovimentos(
    movements: Movement[]
): EvolutionData[] {

    const grouped: Record<string, EvolutionData> = {};

    movements.forEach((movement) => {

        const data = movement.data_movimento;

        if (!grouped[data]) {
            grouped[data] = {
                data,
                receitas: 0,
                despesas: 0,
            };
        }

        if (movement.tipo === "REC") {
            grouped[data].receitas += Number(
                movement.valor
            );
        }

        if (movement.tipo === "DES") {
            grouped[data].despesas += Number(
                movement.valor
            );
        }
    });

    return Object.values(grouped).sort(
        (a, b) =>
            new Date(a.data).getTime() -
            new Date(b.data).getTime()
    );
}


function EvolutionChart() {

    const [data, setData] = useState<EvolutionData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function carregarMovimentos() {

            try {

                const response = await getMovements();

                const evolution = agruparMovimentos(
                    response.results
                );

                setData(evolution);

            } catch (error) {

                console.error(
                    "Erro ao carregar evolução:",
                    error
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
                <div className="card-header">
                    <h2>Evolução financeira</h2>
                </div>

                <div className="chart-placeholder">
                    Carregando gráfico...
                </div>
            </section>
        );
    }


    return (
        <section className="dashboard-card">

            <div className="card-header">
                <h2>Evolução financeira</h2>
            </div>

            <div className="evolution-chart">

                <ResponsiveContainer
                    width="100%"
                    height={320}
                >

                    <LineChart data={data}>

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="data"
                            tickFormatter={formatChartDate}
                        />
                        <YAxis />

                        <Tooltip
                            formatter={(value) =>
                                formatCurrency(
                                    Number(value)
                                )
                            }
                        />

                        <Line
                            type="monotone"
                            dataKey="receitas"
                            name="Receitas"
                            stroke="#16a34a"
                            strokeWidth={2}
                        />

                        <Line
                            type="monotone"
                            dataKey="despesas"
                            name="Despesas"
                            stroke="#dc2626"
                            strokeWidth={2}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </section>
    );
}

export default EvolutionChart;