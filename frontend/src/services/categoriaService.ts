import api from "./api";

export interface Categoria {
    id: number;
    nome: string;
    tipo: "REC" | "DES" | "TRA";
    descricao: string | null;
    ativo: boolean;
}

interface CategoriaResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Categoria[];
}

export interface CreateCategoriaData {
    nome: string;
    tipo: "REC" | "DES" | "TRA";
    descricao: string | null;
    ativo: boolean;
}

export async function getCategorias(): Promise<CategoriaResponse> {
    const response = await api.get<CategoriaResponse>(
        "/financeiro/categorias/"
    );

    return response.data;
}

export async function createCategoria(
    data: CreateCategoriaData
): Promise<Categoria> {
    const response = await api.post<Categoria>(
        "/financeiro/categorias/",
        data
    );

    return response.data;
}

export async function getCategoria(
    id: number
): Promise<Categoria> {
    const response = await api.get<Categoria>(
        `/financeiro/categorias/${id}/`
    );

    return response.data;
}

export async function updateCategoria(
    id: number,
    data: CreateCategoriaData
): Promise<Categoria> {
    const response = await api.put<Categoria>(
        `/financeiro/categorias/${id}/`,
        data
    );

    return response.data;
}

export async function deleteCategoria(
    id: number
): Promise<void> {
    await api.delete(
        `/financeiro/categorias/${id}/`
    );
}