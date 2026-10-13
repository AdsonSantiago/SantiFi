import api, { getAllPages, type PaginatedResponse } from "./api";

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

type MovementResponse = PaginatedResponse<Movimento>;

export interface CreateMovementData {
    conta: number;
    categoria: number | null;
    tipo: "REC" | "DES" | "TRA";
    descricao: string;
    valor: string;
    data_movimento: string;
    observacao: string | null;
}

export async function getMovements(): Promise<MovementResponse> {
    return getAllPages<Movimento>("/financeiro/movimentos/");
}

export async function createMovement(
    data: CreateMovementData
): Promise<Movimento> {
    const response = await api.post<Movimento>(
        "/financeiro/movimentos/",
        data
    );
    return response.data;
}

export async function getMovement(
    id: number
): Promise<Movimento> {
    const response = await api.get<Movimento>(
        `/financeiro/movimentos/${id}/`
    );

    return response.data;
}

export async function updateMovement(
    id: number,
    data: CreateMovementData
): Promise<Movimento> {
    const response = await api.put<Movimento>(
        `/financeiro/movimentos/${id}/`,
        data
    );

    return response.data;
}

export async function deleteMovement(
    id: number
): Promise<void> {
    await api.delete(
        `/financeiro/movimentos/${id}/`
    );
}
