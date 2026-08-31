import { useEffect, useState } from "react";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Movimento } from "../../../services/movementService";
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

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}`;
}

function compareDates(firstDate: string, secondDate: string) {
  return firstDate.localeCompare(secondDate);
}

function agruparMovimentos(
  movements: Movimento[],
): EvolutionData[] {
  const grouped: Record<string, EvolutionData> = {};

  movements.forEach((movement) => {
    const date = movement.data_movimento;

    if (!grouped[date]) {
      grouped[date] = {
        data: date,
        receitas: 0,
        despesas: 0,
      };
    }

    const value = Number(movement.valor) || 0;

    if (movement.tipo === "REC") {
      grouped[date].receitas += value;
    }

    if (movement.tipo === "DES") {
      grouped[date].despesas += value;
    }
  });

  return Object.values(grouped).sort((a, b) =>
    compareDates(a.data, b.data),
  );
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <strong>{label ? formatChartDate(label) : ""}</strong>

      <div className="chart-tooltip-items">
        {payload.map((item) => (
          <div className="chart-tooltip-item" key={item.name}>
            <span>
              <i
                className="chart-tooltip-dot"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>

            <strong>{formatCurrency(item.value)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvolutionChart() {
  const [data, setData] = useState<EvolutionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function carregarMovimentos() {
      try {
        setLoading(true);
        setError("");

        const response = await getMovements();
        const evolution = agruparMovimentos(response.results);

        if (!ignore) {
          setData(evolution);
        }
      } catch (error) {
        console.error("Erro ao carregar evolução:", error);

        if (!ignore) {
          setError("Não foi possível carregar a evolução financeira.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    carregarMovimentos();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section
      className="dashboard-card evolution-card"
      aria-labelledby="evolution-title"
    >
      <div className="card-header evolution-header">
        <div>
          <p className="chart-eyebrow">ANÁLISE DO PERÍODO</p>

          <h2 id="evolution-title">Evolução financeira</h2>

          <p className="chart-description">
            Receitas e despesas ao longo do tempo.
          </p>
        </div>

        <span className="chart-live-status">
          <i aria-hidden="true" />
          Atualizado
        </span>
      </div>

      {loading && (
        <div className="chart-state" role="status">
          <div className="chart-loader" />
          <span>Carregando gráfico...</span>
        </div>
      )}

      {!loading && error && (
        <div className="chart-state chart-state-error" role="alert">
          <span className="chart-state-icon">!</span>
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="chart-state" role="status">
          <span className="chart-state-icon">∅</span>
          <strong>Nenhum movimento encontrado</strong>
          <span>
            Registre uma receita ou despesa para visualizar sua evolução.
          </span>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="evolution-chart">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
          >
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 8,
                left: 8,
                bottom: 4,
              }}
            >
              <CartesianGrid
                stroke="rgba(148, 163, 184, 0.12)"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="data"
                tickFormatter={formatChartDate}
                tick={{
                  fill: "#64748b",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
                minTickGap={24}
              />

              <YAxis
                tick={{
                  fill: "#64748b",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  formatCompactCurrency(Number(value))
                }
                width={72}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "rgba(103, 232, 249, 0.3)",
                  strokeDasharray: "4 4",
                }}
              />

              <Legend
                verticalAlign="top"
                align="right"
                height={32}
                iconType="circle"
                wrapperStyle={{
                  color: "#94a3b8",
                  fontSize: "12px",
                }}
              />

              <Line
                type="monotone"
                dataKey="receitas"
                name="Receitas"
                stroke="#4ade80"
                strokeWidth={3}
                dot={{
                  r: 3,
                  strokeWidth: 2,
                  fill: "#0f172a",
                  stroke: "#4ade80",
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 0,
                  fill: "#4ade80",
                }}
              />

              <Line
                type="monotone"
                dataKey="despesas"
                name="Despesas"
                stroke="#fb7185"
                strokeWidth={3}
                dot={{
                  r: 3,
                  strokeWidth: 2,
                  fill: "#0f172a",
                  stroke: "#fb7185",
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 0,
                  fill: "#fb7185",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

function formatCompactCurrency(value: number): string {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)} mi`;
  }

  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)} mil`;
  }

  return `R$ ${value.toFixed(0)}`;
}

export default EvolutionChart;