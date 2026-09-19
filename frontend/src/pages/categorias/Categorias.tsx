import { useEffect, useMemo, useState } from "react";

import {
  getCategorias,
  deleteCategoria,
} from "../../services/categoriaService";
import type { Categoria } from "../../services/categoriaService";
import CategoriaForm from "./CategoriaForm";

import "./categorias.css";

function getTipoLabel(tipo: Categoria["tipo"]): string {
  const tipos: Record<string, string> = {
    REC: "Receita",
    DES: "Despesa",
    TRA: "Transferência",
  };

  return tipos[tipo] ?? tipo;
}

function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [categoriaEditando, setCategoriaEditando] =
    useState<Categoria | null>(null);

  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");

  async function carregarCategorias() {
    try {
      setCarregando(true);
      setErro("");

      const response = await getCategorias();

      setCategorias(response.results);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      setErro("Não foi possível carregar as categorias.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  const categoriasFiltradas = useMemo(() => {
    const texto = busca.trim().toLowerCase();

    return categorias.filter((categoria) => {
      const correspondeBusca =
        texto === "" ||
        categoria.nome.toLowerCase().includes(texto) ||
        (categoria.descricao ?? "")
          .toLowerCase()
          .includes(texto) ||
        categoria.tipo.toLowerCase().includes(texto);

      const correspondeTipo =
        tipoFiltro === "" || categoria.tipo === tipoFiltro;

      const correspondeStatus =
        statusFiltro === "" ||
        String(categoria.ativo) === statusFiltro;

      return (
        correspondeBusca &&
        correspondeTipo &&
        correspondeStatus
      );
    });
  }, [categorias, busca, tipoFiltro, statusFiltro]);

  const categoriasAtivas = categorias.filter(
    (categoria) => categoria.ativo,
  ).length;

  const categoriasInativas = categorias.filter(
    (categoria) => !categoria.ativo,
  ).length;

  function handleNovaCategoria() {
    setCategoriaEditando(null);
    setMostrarForm(true);
  }

  function handleEditar(categoria: Categoria) {
    setCategoriaEditando(categoria);
    setMostrarForm(true);
  }

  function handleCancelarFormulario() {
    setMostrarForm(false);
    setCategoriaEditando(null);
  }

  async function handleExcluir(categoria: Categoria) {
    const confirmar = window.confirm(
      `Deseja realmente excluir a categoria "${categoria.nome}"?`,
    );

    if (!confirmar) {
      return;
    }

    try {
      setErro("");

      await deleteCategoria(categoria.id);

      await carregarCategorias();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);

      setErro("Não foi possível excluir a categoria.");
    }
  }

  return (
    <div className="categorias-page">
      <header className="categorias-header">
        <div>
          <p className="categorias-eyebrow">
            ORGANIZAÇÃO FINANCEIRA
          </p>

          <h1>Categorias</h1>

          <p className="categorias-description">
            Gerencie suas categorias financeiras.
          </p>
        </div>

        <button
          type="button"
          className="btn-nova-categoria"
          onClick={handleNovaCategoria}
        >
          <span aria-hidden="true">+</span>
          Nova categoria
        </button>
      </header>

      <section
        className="categorias-summary"
        aria-label="Resumo das categorias"
      >
        <article className="categorias-summary-card categorias-summary-main">
          <span>Total de categorias</span>
          <strong>{categorias.length}</strong>
          <small>categorias cadastradas</small>
        </article>

        <article className="categorias-summary-card">
          <span>Categorias ativas</span>
          <strong>{categoriasAtivas}</strong>
          <small>disponíveis para uso</small>
        </article>

        <article className="categorias-summary-card">
          <span>Categorias inativas</span>
          <strong>{categoriasInativas}</strong>
          <small>fora de uso no momento</small>
        </article>
      </section>

      <section
        className="categorias-filtros"
        aria-label="Filtros de categorias"
      >
        <label className="categorias-field">
          <span>Buscar</span>

          <input
            type="text"
            value={busca}
            onChange={(event) =>
              setBusca(event.target.value)
            }
            placeholder="Buscar categoria..."
          />
        </label>

        <label className="categorias-field">
          <span>Tipo</span>

          <select
            value={tipoFiltro}
            onChange={(event) =>
              setTipoFiltro(event.target.value)
            }
          >
            <option value="">Todos os tipos</option>
            <option value="DES">Despesas</option>
            <option value="REC">Receitas</option>
            <option value="TRA">Transferências</option>
          </select>
        </label>

        <label className="categorias-field">
          <span>Status</span>

          <select
            value={statusFiltro}
            onChange={(event) =>
              setStatusFiltro(event.target.value)
            }
          >
            <option value="">Todos os status</option>
            <option value="true">Ativas</option>
            <option value="false">Inativas</option>
          </select>
        </label>
      </section>

      {carregando && (
        <div className="categorias-state" role="status">
          <span className="categorias-loader" />
          <p>Carregando categorias...</p>
        </div>
      )}

      {!carregando && erro && (
        <div
          className="categorias-state categorias-state-error"
          role="alert"
        >
          <span className="categorias-state-icon">!</span>

          <h2>
            Não foi possível carregar as categorias
          </h2>

          <p>{erro}</p>

          <button
            type="button"
            className="categorias-retry-button"
            onClick={carregarCategorias}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!carregando && !erro && (
        <section className="categorias-table-container">
          <div className="categorias-table-header">
            <div>
              <p className="categorias-table-eyebrow">
                VISÃO GERAL
              </p>

              <h2>Minhas categorias</h2>
            </div>

            <span>
              {categoriasFiltradas.length}{" "}
              {categoriasFiltradas.length === 1
                ? "registro"
                : "registros"}
            </span>
          </div>

          {categoriasFiltradas.length === 0 ? (
            <div className="categorias-empty" role="status">
              <span className="categorias-state-icon">∅</span>

              <h3>Nenhuma categoria encontrada</h3>

              <p>
                Tente ajustar os filtros ou cadastre uma
                nova categoria.
              </p>
            </div>
          ) : (
            <div className="categorias-table-wrapper">
              <table className="categorias-table">
                <caption className="sr-only">
                  Lista de categorias financeiras
                </caption>

                <thead>
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Descrição</th>
                    <th scope="col">Status</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {categoriasFiltradas.map((categoria) => (
                    <tr key={categoria.id}>
                      <th scope="row" data-label="Nome">
                        {categoria.nome}
                      </th>

                      <td data-label="Tipo">
                        <span
                          className={`categoria-type categoria-type-${categoria.tipo.toLowerCase()}`}
                        >
                          {getTipoLabel(categoria.tipo)}
                        </span>
                      </td>

                      <td data-label="Descrição">
                        {categoria.descricao || "-"}
                      </td>

                      <td data-label="Status">
                        <span
                          className={`categoria-status ${
                            categoria.ativo
                              ? "ativo"
                              : "inativo"
                          }`}
                        >
                          <i aria-hidden="true" />

                          {categoria.ativo
                            ? "Ativa"
                            : "Inativa"}
                        </span>
                      </td>

                      <td
                        data-label="Ações"
                        className="categorias-actions-cell"
                      >
                        <div className="categorias-actions">
                          <button
                            type="button"
                            className="categoria-action-edit"
                            onClick={() =>
                              handleEditar(categoria)
                            }
                            aria-label={`Editar a categoria ${categoria.nome}`}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="categoria-action-delete"
                            onClick={() =>
                              handleExcluir(categoria)
                            }
                            aria-label={`Excluir a categoria ${categoria.nome}`}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {mostrarForm && (
        <CategoriaForm
          categoria={categoriaEditando}
          onCancel={handleCancelarFormulario}
          onSuccess={() => {
            handleCancelarFormulario();
            carregarCategorias();
          }}
        />
      )}
    </div>
  );
}

export default Categorias;