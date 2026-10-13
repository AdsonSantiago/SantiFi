import api, { getAllPages, type PaginatedResponse } from "./api";

export interface Conta {
    id: number;
    nome: string;
    tipo: string;
    saldo_inicial: string;
    saldo_atual: string;
    ordem: number;
    ativo: boolean;
}

export interface CreateAccountData {
    nome: string;
    tipo: string;
    saldo_inicial: string;
    ordem: number;
    ativo: boolean;
}

export interface UpdateAccountData {
    nome: string;
    tipo: string;
    saldo_inicial: string;
    ordem: number;
    ativo: boolean;
}

type AccountResponse = PaginatedResponse<Conta>;

export async function getAccounts(): Promise<AccountResponse> {
    return getAllPages<Conta>("/financeiro/contas/");
}

export async function createAccount(
    data: CreateAccountData
): Promise<Conta> {
    const response = await api.post<Conta>(
        "/financeiro/contas/",
        data
    );

    return response.data;
}

export async function updateAccount(
    id: number,
    data: UpdateAccountData
): Promise<Conta> {
    const response = await api.put<Conta>(
        `/financeiro/contas/${id}/`,
        data
    );

    return response.data;
}

export async function toggleAccount(
    id: number,
    ativo: boolean
): Promise<Conta> {
    const response = await api.patch<Conta>(
        `/financeiro/contas/${id}/`,
        { ativo }
    );

    return response.data;
}
