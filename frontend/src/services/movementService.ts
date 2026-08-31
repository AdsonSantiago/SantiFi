import api from "./api";

export interface Movimento {
    id: number;
    conta: number;
    categoria: number | null;
    tipo: "REC" | "DES" | "TRA";
    descricao: string;
    valor: string;
    data_movimento: string;
    observacao: string | null;
}

interface MovimentoResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Movimento[];
}

export async function getMovements(): Promise<MovimentoResponse> {

    const response = await api.get<MovimentoResponse>(
        "/financeiro/movimentos/"
    );

    return response.data;
}