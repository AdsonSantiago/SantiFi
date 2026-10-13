import api from "./api";

export interface CurrentUser {
    id: number;
    nome: string;
    sobrenome: string;
    email: string;
    google_configurado: boolean;
}

export type UpdateCurrentUserData = Pick<
    CurrentUser,
    "nome" | "sobrenome" | "email"
>;

export async function getCurrentUser(): Promise<CurrentUser> {
    const response = await api.get<CurrentUser>(
        "/usuarios/me/"
    );

    return response.data;
}

export async function updateCurrentUser(
    data: UpdateCurrentUserData
): Promise<CurrentUser> {
    const response = await api.patch<{
        success: boolean;
        message: string;
        usuario: CurrentUser;
    }>(
        "/usuarios/me/",
        data
    );

    return response.data.usuario;
}

export function logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
}
