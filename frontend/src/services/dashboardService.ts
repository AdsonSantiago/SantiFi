import api from "./api";
import type { Movimento } from "./movementService";

export type DashboardPeriod = "month" | "previous" | "year";

export interface DashboardEvolutionPoint {
    data: string;
    receitas: string;
    despesas: string;
}

export interface DashboardData {
    saldo_atual: string;
    saldo_previsto: string;
    receitas_mes: string;
    despesas_mes: string;
    planejado_receber: string;
    planejado_pagar: string;
    periodo: DashboardPeriod;
    data_inicio: string;
    data_fim: string;
    receitas_periodo: string;
    despesas_periodo: string;
    evolucao: DashboardEvolutionPoint[];
    movimentos_recentes: Movimento[];
}

export async function getDashboard(
    periodo: DashboardPeriod = "month",
): Promise<DashboardData> {

    const response = await api.get<DashboardData>(
        "/financeiro/dashboard/",
        { params: { periodo } },
    );

    return response.data;
}
