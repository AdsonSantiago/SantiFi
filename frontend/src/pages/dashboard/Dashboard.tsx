import { useEffect, useState } from "react";
import type { DashboardData, DashboardPeriod } from "../../services/dashboardService";
import { getDashboard } from "../../services/dashboardService";

import KpiCard from "../../components/dashboard/kpiCard/KpiCard";
import EvolutionChart from "../../components/dashboard/evolutionChart/EvolutionChart";
import RecentMovements from "../../components/dashboard/recentMovements/RecentMovements";
import Alerts from "../../components/dashboard/alerts/Alerts";

import { formatCurrency } from "../../utils/formatCurrency";

import "./dashboard.css";

function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [periodo, setPeriodo] = useState<DashboardPeriod>("month");

  useEffect(() => {
    let ignore = false;

    async function carregarDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboard(periodo);

        if (!ignore) {
          setDashboard(data);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setError("Não foi possível carregar o dashboard.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    carregarDashboard();

    return () => {
      ignore = true;
    };
  }, [periodo]);

  const resultado = dashboard
    ? Number(dashboard.receitas_periodo) - Number(dashboard.despesas_periodo)
    : 0;

  if (loading) {
    return (
      <div className="dashboard-state" role="status">
        <div className="loading-spinner" />
        <p>Carregando seu dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-state dashboard-state-error" role="alert">
        <span className="state-icon">!</span>
        <h2>Não foi possível carregar os dados</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="dashboard-state" role="status">
        <span className="state-icon">∅</span>
        <h2>Nenhum dado encontrado</h2>
        <p>Ainda não existem informações financeiras para exibir.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">VISÃO FINANCEIRA</p>
          <h1>Dashboard</h1>
          <p className="dashboard-description">
            Acompanhe o resumo da sua vida financeira.
          </p>
        </div>

        <div className="dashboard-period">
          <span aria-hidden="true">◷</span>
          <select value={periodo} onChange={(event) => setPeriodo(event.target.value as DashboardPeriod)} aria-label="Período do dashboard">
            <option value="month">Este mês</option>
            <option value="previous">Mês anterior</option>
            <option value="year">Este ano</option>
          </select>
        </div>
      </header>

      <section
        className="kpi-grid"
        aria-label="Resumo financeiro"
      >
        <KpiCard
          title="Saldo total"
          value={formatCurrency(dashboard.saldo_atual)}
          main
        />

        <KpiCard
          title="Receitas"
          value={formatCurrency(dashboard.receitas_periodo)}
        />

        <KpiCard
          title="Despesas"
          value={formatCurrency(dashboard.despesas_periodo)}
        />

        <KpiCard
          title="Resultado"
          value={formatCurrency(resultado)}
        />
      </section>

      <section className="dashboard-main">
        <div className="dashboard-card evolution-card">
          <EvolutionChart data={dashboard.evolucao} periodo={dashboard.periodo} />
        </div>

        <div className="dashboard-card alerts-card">
          <Alerts
            planejadoReceber={dashboard.planejado_receber}
            planejadoPagar={dashboard.planejado_pagar}
          />
        </div>
      </section>

      <section className="dashboard-card movements-card">
        <RecentMovements movements={dashboard.movimentos_recentes} />
      </section>
    </div>
  );
}

export default Dashboard;
