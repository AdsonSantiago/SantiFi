import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

import { createMovement, type CreateMovementData,
} from "../../../services/movementService";

import { getAccounts } from "../../../services/accountService";
import { getCategories } from "../../../services/categoryService";

interface MovimentoFormProps {
    onSuccess: () => void;
}

function MovimentoForm({
    onSuccess,
}: MovimentoFormProps) {
    const [conta, setConta] = useState("");
    const [tipo, setTipo] = useState<"REC" | "DES">("DES");
    const [categoria, setCategoria] = useState("");
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [dataMovimento, setDataMovimento] = useState("");
    const [observacao, setObservacao] = useState("");

    const [contas, setContas] = useState<
        Awaited<ReturnType<typeof getAccounts>>["results"]
    >([]);

    const [categorias, setCategorias] = useState<
        Awaited<ReturnType<typeof getCategories>>["results"]
    >([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [mostrarObservacao, setMostrarObservacao] = useState(false);

    useEffect(() => {
        async function carregarDados() {
            try {
                setLoading(true);
                setError("");

                const [contasResponse, categoriasResponse] =
                    await Promise.all([
                        getAccounts(),
                        getCategories(),
                    ]);

                const contasAtivas = contasResponse.results.filter(
                    (conta) => conta.ativo
                );

                setContas(contasAtivas);
                setCategorias(
                    categoriasResponse.results.filter(
                        (categoria) => categoria.ativo
                    )
                );

                if (contasAtivas.length > 0) {
                    setConta(String(contasAtivas[0].id));
                }

                const hoje = new Date()
                    .toISOString()
                    .split("T")[0];

                setDataMovimento(hoje);
            } catch (error) {
                console.error(error);
                setError(
                    "Não foi possível carregar os dados do formulário."
                );
            } finally {
                setLoading(false);
            }
        }

        carregarDados();
    }, []);

    const categoriasFiltradas = useMemo(() => {
        return categorias.filter(
            (categoria) => categoria.tipo === tipo
        );
    }, [categorias, tipo]);

    useEffect(() => {
        setCategoria("");
    }, [tipo]);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!conta) {
            setError("Selecione uma conta.");
            return;
        }

        if (!categoria) {
            setError("Selecione uma categoria.");
            return;
        }

        if (!valor) {
            setError("Informe o valor.");
            return;
        }

        if (!dataMovimento) {
            setError("Informe a data do movimento.");
            return;
        }

        const movimento: CreateMovementData = {
            conta: Number(conta),
            categoria: Number(categoria),
            tipo,
            descricao: descricao.trim(),
            valor,
            data_movimento: dataMovimento,
            observacao: observacao.trim() || null,
        };

        try {
            setSaving(true);
            setError("");

            const data = await createMovement(movimento);

            console.log("Movimento criado:", data);

            onSuccess();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(
                    "Resposta da API:",
                    error.response?.data
                );

                setError(
                    error.response?.data?.errors
                        ?.non_field_errors?.[0] ||
                    "Não foi possível salvar o movimento."
                );
            } else {
                console.error(
                    "Erro ao criar movimento:",
                    error
                );

                setError(
                    "Ocorreu um erro ao salvar o movimento."
                );
            }
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="movimento-form-state">
                <p>Carregando formulário...</p>
            </div>
        );
    }

    return (
        <form
            className="movimento-form"
            onSubmit={handleSubmit}
        >
            <header className="movimento-form-header">
                <p className="movimento-form-eyebrow">
                    NOVO LANÇAMENTO
                </p>

                <h2>Novo movimento</h2>

                <p>
                    Registre uma receita ou uma despesa.
                </p>
            </header>

            {error && (
                <div
                    className="movimento-form-error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            <div className="movimento-form-field">
                <label>O que aconteceu?</label>

                <div className="movimento-type-selector">
                    <button
                        type="button"
                        className={
                            tipo === "DES"
                                ? "active"
                                : ""
                        }
                        onClick={() => setTipo("DES")}
                    >
                        Despesa
                    </button>

                    <button
                        type="button"
                        className={
                            tipo === "REC"
                                ? "active"
                                : ""
                        }
                        onClick={() => setTipo("REC")}
                    >
                        Receita
                    </button>
                </div>
            </div>

            <div className="movimento-form-field movimento-form-value">
                <label htmlFor="valor">
                    Valor
                </label>

                <div className="value-input">
                    <span>R$</span>

                    <input
                        id="valor"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={valor}
                        onChange={(event) =>
                            setValor(event.target.value)
                        }
                        placeholder="0,00"
                        required
                    />
                </div>
            </div>

            <div className="movimento-form-grid">
                <div className="movimento-form-field">
                    <label htmlFor="conta">
                        Conta
                    </label>

                    <select
                        id="conta"
                        value={conta}
                        onChange={(event) =>
                            setConta(event.target.value)
                        }
                        required
                    >
                        <option value="">
                            Selecione uma conta
                        </option>

                        {contas.map((conta) => (
                            <option
                                key={conta.id}
                                value={conta.id}
                            >
                                {conta.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="movimento-form-field">
                    <label htmlFor="categoria">
                        Categoria
                    </label>

                    <select
                        id="categoria"
                        value={categoria}
                        onChange={(event) =>
                            setCategoria(event.target.value)
                        }
                        required
                    >
                        <option value="">
                            Selecione uma categoria
                        </option>

                        {categoriasFiltradas.map(
                            (categoria) => (
                                <option
                                    key={categoria.id}
                                    value={categoria.id}
                                >
                                    {categoria.nome}
                                </option>
                            )
                        )}
                    </select>
                </div>
            </div>

            <div className="movimento-form-field">
                <label htmlFor="descricao">
                    Descrição
                    <span>Opcional</span>
                </label>

                <input
                    id="descricao"
                    type="text"
                    value={descricao}
                    onChange={(event) =>
                        setDescricao(event.target.value)
                    }
                    placeholder="Ex.: Compra do mês"
                />
            </div>

            <div className="movimento-form-field">
                <label htmlFor="dataMovimento">
                    Data
                </label>

                <input
                    id="dataMovimento"
                    type="date"
                    value={dataMovimento}
                    onChange={(event) =>
                        setDataMovimento(event.target.value)
                    }
                    required
                />
            </div>

            <div className="movimento-form-details">
                <button
                    type="button"
                    onClick={() =>
                        setMostrarObservacao(
                            !mostrarObservacao
                        )
                    }
                >
                    {mostrarObservacao
                        ? "− Remover observação"
                        : "+ Adicionar observação"}
                </button>

                {mostrarObservacao && (
                    <div className="movimento-form-field">
                        <label htmlFor="observacao">
                            Observação
                            <span>Opcional</span>
                        </label>

                        <textarea
                            id="observacao"
                            value={observacao}
                            onChange={(event) =>
                                setObservacao(
                                    event.target.value
                                )
                            }
                            placeholder="Adicione algum detalhe..."
                            rows={3}
                        />
                    </div>
                )}
            </div>

            <button
                className="movimento-form-submit"
                type="submit"
                disabled={saving}
            >
                {saving
                    ? "Salvando..."
                    : "Salvar movimento"}
            </button>
        </form>
    );
}

export default MovimentoForm;