import api from "./api";

export interface Movement {
    id: number;
    conta: number;
    categoria: number | null;
    tipo: "REC" | "DES" | "TRA";
    descricao: string;
    valor: string;
    data_movimento: string;
    observacao: string | null;
}

interface MovementResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Movement[];
}

export async function getMovements(): Promise<MovementResponse> {
    const response = await api.get<MovementResponse>(
        "/financeiro/movimentos/"
    );

    return response.data;
}
