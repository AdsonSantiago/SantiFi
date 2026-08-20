import api from "./api";

export interface CurrentUser {
    id: number;
    nome: string;
    sobrenome: string;
    email: string;
}

export async function getCurrentUser(): Promise<CurrentUser> {

    const response = await api.get<CurrentUser>(
        "/usuarios/me/"
    );

    return response.data;
}


export function logout(): void {

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

}