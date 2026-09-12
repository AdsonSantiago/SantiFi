import api from "./api";

export interface Categoria {
    id: number;
    nome: string;
    tipo: "REC" | "DES" | "TRA";
    descricao: string | null;
    ativo: boolean;
}

interface CategoryResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Categoria[];
}

export async function getCategories(): Promise<CategoryResponse> {
    const response = await api.get<CategoryResponse>(
        "/financeiro/categorias/"
    );

    return response.data;
}