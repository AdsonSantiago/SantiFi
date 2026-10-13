import api from "./api";

export interface MovementDraft {
  tipo: "REC" | "DES" | null;
  valor: string | null;
  data_movimento: string | null;
  descricao: string;
  conta_id: number | null;
  categoria_id: number | null;
  categoria_nome_sugerida: string;
  pergunta: string;
}

export async function createMovementDraft(texto: string): Promise<MovementDraft> {
  const response = await api.post<MovementDraft>(
    "/financeiro/assistente/movimento/",
    { texto },
  );
  return response.data;
}
