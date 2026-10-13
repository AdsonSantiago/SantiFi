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

import type { DashboardEvolutionPoint, DashboardPeriod } from "../../../services/dashboardService";

import { formatCurrency } from "../../../utils/formatCurrency";

import "./evolutionChart.css";

function formatChartDate(date: string): string {
  const [year, month, day] = date.split("-");

  if (!year || !month) {
    return date;
  }

  return day ? `${day}/${month}` : `${month}/${year}`;
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

function EvolutionChart({ data, periodo }: { data: DashboardEvolutionPoint[]; periodo: DashboardPeriod }) {
  const chartData = data.map((point) => ({
    ...point,
    receitas: Number(point.receitas) || 0,
    despesas: Number(point.despesas) || 0,
  }));
  const hasValues = chartData.some((point) => point.receitas > 0 || point.despesas > 0);

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
            {periodo === "year" ? "Receitas e despesas por mês." : "Receitas e despesas por dia."}
          </p>
        </div>

        <span className="chart-live-status">
          <i aria-hidden="true" />
          Atualizado
        </span>
      </div>

      {(!chartData.length || !hasValues) && (
        <div className="chart-state" role="status">
          <span className="chart-state-icon">∅</span>
          <strong>Nenhum movimento encontrado</strong>
          <span>
            Registre uma receita ou despesa para visualizar sua evolução.
          </span>
        </div>
      )}

      {chartData.length > 0 && hasValues && (
        <div className="evolution-chart">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
          >
            <LineChart
              data={chartData}
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
