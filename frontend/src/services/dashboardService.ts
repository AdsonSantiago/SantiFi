import api from "./api";

export interface DashboardData {
    saldo_atual: string;
    saldo_previsto: string;
    receitas_mes: string;
    despesas_mes: string;
    planejado_receber: string;
    planejado_pagar: string;
}

export async function getDashboard(): Promise<DashboardData> {

    const response = await api.get<DashboardData>(
        "/financeiro/dashboard/"
    );

    return response.data;
}