import { useEffect, useState } from "react";

import type { DashboardData } from "../../services/dashboardService";
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


    useEffect(() => {

        async function carregarDashboard() {

            try {

                const data = await getDashboard();

                setDashboard(data);

            } catch (error) {

                console.error(error);

                setError(
                    "Não foi possível carregar o dashboard."
                );

            } finally {

                setLoading(false);

            }
        }

        carregarDashboard();

    }, []);


    const resultado = dashboard
        ? Number(dashboard.receitas_mes) -
          Number(dashboard.despesas_mes)
        : 0;


    if (loading) {
        return <p>Carregando dashboard...</p>;
    }


    if (error) {
        return <p>{error}</p>;
    }


    if (!dashboard) {
        return <p>Não foi possível carregar os dados.</p>;
    }


    return (
        <div className="dashboard">

            <section className="dashboard-header">

                <h1>Dashboard</h1>

                <p>
                    Visão geral das suas finanças.
                </p>

            </section>


            <section className="kpi-grid">

                <KpiCard
                    title="Saldo total"
                    value={formatCurrency(
                        dashboard.saldo_atual
                    )}
                    main
                />

                <KpiCard
                    title="Receitas"
                    value={formatCurrency(
                        dashboard.receitas_mes
                    )}
                />

                <KpiCard
                    title="Despesas"
                    value={formatCurrency(
                        dashboard.despesas_mes
                    )}
                />

                <KpiCard
                    title="Resultado"
                    value={formatCurrency(
                        resultado
                    )}
                />

            </section>


            <section className="dashboard-main">

                <EvolutionChart />

                <Alerts
                    planejadoReceber={
                        dashboard.planejado_receber
                    }
                    planejadoPagar={
                        dashboard.planejado_pagar
                    }
                />

            </section>


            <section>
                <RecentMovements />
            </section>

        </div>
    );
}

export default Dashboard;