import { useEffect, useState } from "react";

import type { Conta } from "../../services/accountService";
import { getAccounts } from "../../services/accountService";

import ContasTable from "../../components/contasTable/ContasTable";

import "./contas.css";

function Contas() {
    const [contas, setContas] = useState<Conta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function carregarContas() {
            try {
                setLoading(true);
                setError("");

                const data = await getAccounts();

                if (!ignore) {
                    setContas(data.results);
                }
            } catch (error) {
                console.error(error);

                if (!ignore) {
                    setError(
                        "Não foi possível carregar suas contas."
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        carregarContas();

        return () => {
            ignore = true;
        };
    }, []);

    if (loading) {
        return (
            <div className="contas-state">
                <p>Carregando suas contas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="contas-state contas-state-error"
                role="alert"
            >
                <h2>Não foi possível carregar as contas</h2>

                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="contas">
            <header className="contas-header">
                <div>
                    <p className="contas-eyebrow">
                        ORGANIZAÇÃO FINANCEIRA
                    </p>

                    <h1>Contas</h1>

                    <p className="contas-description">
                        Gerencie suas contas e acompanhe
                        seus saldos.
                    </p>
                </div>

                <button
                    type="button"
                    className="contas-add-button"
                >
                    + Nova conta
                </button>
            </header>

            <section
                className="contas-summary"
                aria-label="Resumo das contas"
            >
                <div>
                    <span>Total de contas</span>

                    <strong>{contas.length}</strong>
                </div>
            </section>

            <section className="contas-list">
                <ContasTable contas={contas} />
            </section>
        </div>
    );
}

export default Contas;