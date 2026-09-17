import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { FormEvent } from "react";
import axios from "axios";

import type {
    Movimento,
    CreateMovementData,
} from "../../../services/movementService";

import {
    createMovement,
    updateMovement,
} from "../../../services/movementService";

import { getAccounts } from "../../../services/accountService";
import { getCategories } from "../../../services/categoryService";

import "./movimentoForm.css";

interface MovimentoFormProps {
    movimento?: Movimento | null;
    onSuccess: () => void;
    onCancel: () => void;
}

function getTodayDate(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function MovimentoForm({
  movimento,
  onSuccess,
  onCancel,
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
  const [mostrarObservacao, setMostrarObservacao] =
    useState(false);

  const modoEdicao = Boolean(movimento);

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
                  (item) => item.ativo
              );

              const categoriasAtivas =
                  categoriasResponse.results.filter(
                      (item) => item.ativo
                  );

              setContas(contasAtivas);
              setCategorias(categoriasAtivas);

              if (movimento) {
                  setConta(String(movimento.conta));
                  setTipo(
                      movimento.tipo === "REC"
                          ? "REC"
                          : "DES"
                  );
                  setCategoria(
                      movimento.categoria
                          ? String(movimento.categoria)
                          : ""
                  );
                  setDescricao(movimento.descricao);
                  setValor(movimento.valor);
                  setDataMovimento(movimento.data_movimento);
                  setObservacao(
                      movimento.observacao ?? ""
                  );
                  setMostrarObservacao(
                      Boolean(movimento.observacao)
                  );
              } else {
                  setConta("");
                  setTipo("DES");
                  setCategoria("");
                  setDescricao("");
                  setValor("");
                  setObservacao("");
                  setMostrarObservacao(false);

                  setDataMovimento(getTodayDate());
              }
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
  }, [movimento]);


  const categoriasFiltradas = useMemo(() => {
    return categorias.filter(
      (item) => item.tipo === tipo,
    );
  }, [categorias, tipo]);

  useEffect(() => {
    const categoriaAtualExiste = categoriasFiltradas.some(
      (item) => String(item.id) === categoria,
    );

    if (!categoriaAtualExiste) {
      setCategoria("");
    }
  }, [categoriasFiltradas, categoria]);

  function handleTipoChange(nextTipo: "REC" | "DES") {
    setTipo(nextTipo);
    setCategoria("");
    setError("");
  }

  function getApiErrorMessage(error: unknown): string {
    if (!axios.isAxiosError(error)) {
      return "Ocorreu um erro ao salvar o movimento.";
    }

    const responseData = error.response?.data;

    return (
      responseData?.errors?.non_field_errors?.[0] ||
      responseData?.detail ||
      responseData?.message ||
      "Não foi possível salvar o movimento."
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const numericValue = Number(valor);
    const numericAccount = Number(conta);
    const numericCategory = Number(categoria);

    if (!conta || !Number.isInteger(numericAccount)) {
      setError("Selecione uma conta válida.");
      return;
    }

    if (
      !categoria ||
      !Number.isInteger(numericCategory)
    ) {
      setError("Selecione uma categoria válida.");
      return;
    }

    if (
      !valor ||
      Number.isNaN(numericValue) ||
      numericValue <= 0
    ) {
      setError("Informe um valor maior que zero.");
      return;
    }

    if (!dataMovimento) {
      setError("Informe a data do movimento.");
      return;
    }

    const movimentoData: CreateMovementData = {
        conta: numericAccount,
        categoria: numericCategory,
        tipo,
        descricao: descricao.trim(),
        valor,
        data_movimento: dataMovimento,
        observacao: observacao.trim() || null,
    };

    try {
        console.log("Payload enviado:", movimento);

        setSaving(true);
        setError("");

        if (modoEdicao && movimento) {
            await updateMovement(
                movimento.id,
                movimentoData
            );
        } else {
          await createMovement(movimentoData);
        }

        onSuccess();
    } catch (error) {
        console.error("Erro ao salvar movimento:", error);
        setError(getApiErrorMessage(error));
    } finally {
        setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="movimento-form-state" role="status">
        <span className="movimento-form-spinner" />
        <p>Carregando formulário...</p>
      </div>
    );
  }

  return (
      <div className="movimento-form-container">
        <button
          type="button"
          className="movimento-form-backdrop"
          onClick={saving ? undefined : onCancel}
          aria-label="Fechar formulário"
          disabled={saving}
        />

        <form
          className="movimento-form"
          onSubmit={handleSubmit}
          role="dialog"
          aria-modal="true"
          aria-labelledby="movimento-form-title"
          noValidate
        >
        <header className="movimento-form-header">
          <div>

            <p className="movimento-form-eyebrow">
                {modoEdicao ? "EDIÇÃO DE LANÇAMENTO" : "NOVO LANÇAMENTO"}
            </p>

            <h2 id="movimento-form-title">
                {modoEdicao ? "Editar movimento" : "Novo movimento"}
            </h2>

            <p>
                {modoEdicao
                    ? "Atualize os dados do movimento."
                    : "Registre uma receita ou uma despesa."}
            </p>
          </div>

          <button
            type="button"
            className="movimento-form-close"
            onClick={onCancel}
            disabled={saving}
            aria-label="Fechar formulário"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {error && (
          <div
            className="movimento-form-error"
            role="alert"
          >
            <span aria-hidden="true">!</span>
            {error}
          </div>
        )}

        <fieldset
          className="movimento-form-fields"
          disabled={saving}
        >
          <legend className="sr-only">
            Dados do movimento
          </legend>

          <div className="movimento-form-field">
            <span className="movimento-field-label">
              O que aconteceu?
              <span aria-hidden="true">*</span>
            </span>

            <div
              className="movimento-type-selector"
              role="group"
              aria-label="Tipo do movimento"
            >
              <button
                type="button"
                className={
                  tipo === "DES" ? "active expense" : ""
                }
                onClick={() => handleTipoChange("DES")}
                aria-pressed={tipo === "DES"}
              >
                <span aria-hidden="true">↘</span>
                Despesa
              </button>

              <button
                type="button"
                className={
                  tipo === "REC" ? "active income" : ""
                }
                onClick={() => handleTipoChange("REC")}
                aria-pressed={tipo === "REC"}
              >
                <span aria-hidden="true">↗</span>
                Receita
              </button>
            </div>
          </div>

          <div className="movimento-form-field movimento-form-value">
            <label htmlFor="valor">
              Valor
              <span aria-hidden="true">*</span>
            </label>

            <div className="value-input">
              <span aria-hidden="true">R$</span>

              <input
                id="valor"
                name="valor"
                type="number"
                step="0.01"
                min="0.01"
                value={valor}
                onChange={(event) => {
                  setValor(event.target.value);
                  setError("");
                }}
                placeholder="0,00"
                inputMode="decimal"
                required
                aria-required="true"
              />
            </div>
          </div>

          <div className="movimento-form-grid">
            <div className="movimento-form-field">
              <label htmlFor="conta">
                Conta
                <span aria-hidden="true">*</span>
              </label>

              <select
                id="conta"
                name="conta"
                value={conta}
                onChange={(event) => {
                  setConta(event.target.value);
                  setError("");
                }}
                required
                aria-required="true"
              >
                {contas.length === 0 ? (
                  <option value="">
                    Nenhuma conta ativa disponível
                  </option>
                ) : (
                  <>
                    <option value="">
                      Selecione uma conta
                    </option>

                    {contas.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.nome}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div className="movimento-form-field">
              <label htmlFor="categoria">
                Categoria
                <span aria-hidden="true">*</span>
              </label>

              <select
                id="categoria"
                name="categoria"
                value={categoria}
                onChange={(event) => {
                  setCategoria(event.target.value);
                  setError("");
                }}
                required
                aria-required="true"
              >
                <option value="">
                  Selecione uma categoria
                </option>

                {categoriasFiltradas.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="movimento-form-grid">
            <div className="movimento-form-field">
              <label htmlFor="descricao">
                Descrição
                <span className="optional">Opcional</span>
              </label>

              <input
                id="descricao"
                name="descricao"
                type="text"
                value={descricao}
                onChange={(event) =>
                  setDescricao(event.target.value)
                }
                placeholder="Ex.: Compra do mês"
                maxLength={150}
              />
            </div>

            <div className="movimento-form-field">
              <label htmlFor="dataMovimento">
                Data
                <span aria-hidden="true">*</span>
              </label>

              <input
                id="dataMovimento"
                name="data_movimento"
                type="date"
                value={dataMovimento}
                onChange={(event) => {
                  setDataMovimento(event.target.value);
                  setError("");
                }}
                required
                aria-required="true"
              />
            </div>
          </div>

          <div className="movimento-form-details">
            <button
              type="button"
              className="movimento-details-toggle"
              onClick={() =>
                setMostrarObservacao(
                  (current) => !current,
                )
              }
              aria-expanded={mostrarObservacao}
              aria-controls="observacao-container"
            >
              <span aria-hidden="true">
                {mostrarObservacao ? "−" : "+"}
              </span>

              {mostrarObservacao
                ? "Remover observação"
                : "Adicionar observação"}
            </button>

            {mostrarObservacao && (
              <div
                id="observacao-container"
                className="movimento-form-field"
              >
                <label htmlFor="observacao">
                  Observação
                  <span className="optional">
                    Opcional
                  </span>
                </label>

                <textarea
                  id="observacao"
                  name="observacao"
                  value={observacao}
                  onChange={(event) =>
                    setObservacao(event.target.value)
                  }
                  placeholder="Adicione algum detalhe..."
                  rows={3}
                  maxLength={500}
                />
              </div>
            )}
          </div>
        </fieldset>

        <div className="movimento-form-actions">
          {onCancel && (
            <button
              type="button"
              className="movimento-form-cancel"
              onClick={onCancel}
              disabled={saving}
            >
              Cancelar
            </button>
          )}

          <button
            className="movimento-form-submit"
            type="submit"
            disabled={saving}
          >
            {saving ? (
                <>
                    <span
                        className="movimento-submit-spinner"
                        aria-hidden="true"
                    />
                    Salvando...
                </>
            ) : (
                modoEdicao
                    ? "Salvar alterações"
                    : "Salvar movimento"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MovimentoForm;