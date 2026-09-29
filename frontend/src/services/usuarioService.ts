import api from "./api";

export interface CreateUsuarioData {
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
    confirmar_senha: string;
    timezone: string;
}

export interface Usuario {
    id: number;
    nome: string;
    sobrenome: string;
    email: string;
    timezone: string;
}

export async function createUsuario(
    data: CreateUsuarioData
): Promise<Usuario> {
    const response = await api.post<{
        success: boolean;
        message: string;
        usuario: Usuario;
    }>(
        "/auth/cadastro/",
        data
    );

    return response.data.usuario;
}