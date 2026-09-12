import { useEffect, useMemo, useState } from "react";

import type { Movimento } from "../../services/movementService";
import { getMovements } from "../../services/movementService";

import MovimentosTable from "../../components/movimentos/movimentosTable";
import MovimentoForm from "../../components/movimentos/movimentoForm/MovimentoForm";

import "./movimentos.css";

function Movimentos() {
  const [movimentos, setMovimentos] = useState<Movimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [formAberto, setFormAberto] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function carregarMovimentos() {
      try {
        setLoading(true);
        setError("");

        const data = await getMovements();

        if (!ignore) {
          setMovimentos(data.results);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setError("Não foi possível carregar os movimentos.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    carregarMovimentos();

    return () => {
      ignore = true;
    };
  }, []);

  async function atualizarMovimentos() {
    try {
      const data = await getMovements();
      setMovimentos(data.results);
    } catch (error) {
      console.error("Erro ao atualizar movimentos:", error);
    }
  }

  const movimentosFiltrados = useMemo(() => {
    const texto = busca.trim().toLowerCase();

    return movimentos.filter((movimento) => {
      const matchesBusca =
        texto === "" ||
        movimento.descricao.toLowerCase().includes(texto) ||
        (movimento.observacao ?? "").toLowerCase().includes(texto) ||
        movimento.tipo.toLowerCase().includes(texto) ||
        movimento.data_movimento.includes(texto);

      const matchesTipo =
        tipoFiltro === "" || movimento.tipo === tipoFiltro;

      return matchesBusca && matchesTipo;
    });
  }, [busca, tipoFiltro, movimentos]);

  const temMovimentos = movimentosFiltrados.length > 0;

  return (
    <div className="movimentos">
      <section className="movimentos-header">
        <div>
          <p className="movimentos-eyebrow">LANÇAMENTOS</p>
          <h1>Movimentos</h1>
          <p>
            Consulte suas receitas, despesas e transferências.
          </p>
        </div>

        <button
            type="button"
            className="movimentos-button"
            onClick={() => setFormAberto(true)}
        >
            + Novo movimento
        </button>
      </section>

      <section className="movimentos-filtros" aria-label="Filtros de movimentos">
        <label className="movimentos-field">
          <span>Buscar</span>

          <input
            type="text"
            placeholder="Buscar movimento..."
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
        </label>

        <label className="movimentos-field">
          <span>Tipo</span>

          <select
            value={tipoFiltro}
            onChange={(event) => setTipoFiltro(event.target.value)}
          >
            <option value="">Todos os tipos</option>
            <option value="REC">Receitas</option>
            <option value="DES">Despesas</option>
            <option value="TRA">Transferências</option>
          </select>
        </label>
      </section>

      <section className="movimentos-tabela">
        {loading && (
          <div className="movimentos-state" role="status">
            <div className="movimentos-loader" />
            <p>Carregando movimentos...</p>
          </div>
        )}

        {!loading && error && (
          <div className="movimentos-state movimentos-state-error" role="alert">
            <span className="movimentos-state-icon">!</span>
            <strong>Ops, algo deu errado</strong>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && !temMovimentos && (
          <div className="movimentos-state" role="status">
            <span className="movimentos-state-icon">∅</span>
            <strong>Nenhum movimento encontrado</strong>
            <p>
              Tente ajustar os filtros ou cadastre um novo lançamento.
            </p>
          </div>
        )}

        {!loading && !error && temMovimentos && (
          <MovimentosTable movimentos={movimentosFiltrados} />
        )}
      </section>
      
      {formAberto && (
        <div className="movimento-modal">

            <div className="movimento-modal-content">

                <div className="movimento-modal-header">

                    <div>
                        <span>LANÇAMENTO</span>

                        <h2>Novo movimento</h2>
                    </div>

                    <button
                        type="button"
                        onClick={() => setFormAberto(false)}
                        aria-label="Fechar formulário"
                    >
                        ×
                    </button>

                </div>

                <MovimentoForm
                  onSuccess={async () => {
                    await atualizarMovimentos();
                    setFormAberto(false);
                  }}
                />
            </div>

        </div>
    )}
    </div>
  );
}

export default Movimentos;