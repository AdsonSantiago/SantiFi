import {
  useEffect,
  useState,
} from "react";

import type { FormEvent } from "react";

import {
  createCategoria,
  updateCategoria,
} from "../../services/categoriaService";

import type {
  Categoria,
  CreateCategoriaData,
} from "../../services/categoriaService";

import "./categoriaForm.css";

interface CategoriaFormProps {
  categoria?: Categoria | null;
  onCancel: () => void;
  onSuccess: () => void;
}

type TipoCategoria = "REC" | "DES" | "TRA";

function CategoriaForm({
  categoria,
  onCancel,
  onSuccess,
}: CategoriaFormProps) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<TipoCategoria>("DES");
  const [descricao, setDescricao] = useState("");
  const [ativo, setAtivo] = useState(true);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const editando = Boolean(categoria);

  useEffect(() => {
    if (categoria) {
      setNome(categoria.nome);
      setTipo(categoria.tipo);
      setDescricao(categoria.descricao ?? "");
      setAtivo(categoria.ativo);
    } else {
      setNome("");
      setTipo("DES");
      setDescricao("");
      setAtivo(true);
    }

    setErro("");
  }, [categoria]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !salvando) {
        onCancel();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [onCancel, salvando]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nomeNormalizado = nome.trim();
    const descricaoNormalizada = descricao.trim();

    if (!nomeNormalizado) {
      setErro("Informe o nome da categoria.");
      return;
    }

    if (nomeNormalizado.length < 2) {
      setErro(
        "O nome deve ter pelo menos 2 caracteres.",
      );
      return;
    }

    try {
      setSalvando(true);
      setErro("");

      const data: CreateCategoriaData = {
        nome: nomeNormalizado,
        tipo,
        descricao: descricaoNormalizada || null,
        ativo,
      };

      if (categoria) {
        await updateCategoria(categoria.id, data);
      } else {
        await createCategoria(data);
      }

      onSuccess();
    } catch (error) {
      console.error(
        "Erro ao salvar categoria:",
        error,
      );

      setErro(
        editando
          ? "Não foi possível atualizar a categoria."
          : "Não foi possível criar a categoria.",
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="categoria-form-container">
      <button
        type="button"
        className="categoria-form-backdrop"
        onClick={salvando ? undefined : onCancel}
        disabled={salvando}
        aria-label="Fechar formulário"
      />

      <form
        className="categoria-form"
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="categoria-form-title"
        noValidate
      >
        <header className="categoria-form-header">
          <div>
            <p className="categoria-form-eyebrow">
              ORGANIZAÇÃO FINANCEIRA
            </p>

            <h2 id="categoria-form-title">
              {editando
                ? "Editar categoria"
                : "Nova categoria"}
            </h2>

            <p>
              {editando
                ? "Atualize as informações da categoria."
                : "Cadastre uma categoria para organizar seus movimentos."}
            </p>
          </div>

          <button
            type="button"
            className="categoria-form-close"
            onClick={onCancel}
            disabled={salvando}
            aria-label="Fechar formulário"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {erro && (
          <div
            className="categoria-form-error"
            role="alert"
          >
            <span aria-hidden="true">!</span>
            {erro}
          </div>
        )}

        <fieldset
          className="categoria-form-fields"
          disabled={salvando}
        >
          <legend className="sr-only">
            Dados da categoria
          </legend>

          <div className="categoria-form-field">
            <label htmlFor="categoria-nome">
              Nome
              <span aria-hidden="true">*</span>
            </label>

            <input
              id="categoria-nome"
              name="nome"
              type="text"
              value={nome}
              onChange={(event) => {
                setNome(event.target.value);
                setErro("");
              }}
              placeholder="Ex.: Alimentação"
              maxLength={80}
              required
              autoFocus
            />
          </div>

          <div className="categoria-form-field">
            <label htmlFor="categoria-tipo">
              Tipo
              <span aria-hidden="true">*</span>
            </label>

            <select
              id="categoria-tipo"
              name="tipo"
              value={tipo}
              onChange={(event) => {
                setTipo(
                  event.target.value as TipoCategoria,
                );
                setErro("");
              }}
              required
            >
              <option value="DES">Despesa</option>
              <option value="REC">Receita</option>
              <option value="TRA">Transferência</option>
            </select>
          </div>

          <div className="categoria-form-field">
            <label htmlFor="categoria-descricao">
              Descrição
              <span className="optional">Opcional</span>
            </label>

            <textarea
              id="categoria-descricao"
              name="descricao"
              value={descricao}
              onChange={(event) =>
                setDescricao(event.target.value)
              }
              placeholder="Explique o uso desta categoria..."
              rows={3}
              maxLength={180}
            />
          </div>

          <label className="categoria-checkbox">
            <input
              id="categoria-ativo"
              name="ativo"
              type="checkbox"
              checked={ativo}
              onChange={(event) =>
                setAtivo(event.target.checked)
              }
            />

            <span
              className="categoria-checkbox-mark"
              aria-hidden="true"
            />

            <span>
              <strong>Categoria ativa</strong>
              <small>
                Disponível para novos movimentos
              </small>
            </span>
          </label>
        </fieldset>

        <div className="categoria-form-actions">
          <button
            type="button"
            className="categoria-form-cancel"
            onClick={onCancel}
            disabled={salvando}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="categoria-form-submit"
            disabled={salvando}
          >
            {salvando ? (
              <>
                <span
                  className="categoria-spinner"
                  aria-hidden="true"
                />
                Salvando...
              </>
            ) : editando ? (
              "Atualizar categoria"
            ) : (
              "Salvar categoria"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CategoriaForm;