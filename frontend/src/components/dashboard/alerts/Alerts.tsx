import { formatCurrency } from "../../../utils/formatCurrency";
import "./alertas-style.css";

interface AlertsProps {
    planejadoReceber: string;
    planejadoPagar: string;
}

function Alerts({
    planejadoReceber,
    planejadoPagar,
}: AlertsProps) {

    const receber = Number(planejadoReceber);
    const pagar = Number(planejadoPagar);

    return (
        <section className="dashboard-card alerts-card">

            <div className="card-header">
                <h2>Alertas e pendências</h2>
            </div>

            <div className="alerts-list">

                {pagar > 0 && (
                    <div className="alert-item">
                        <strong>Contas a pagar</strong>

                        <span>
                            {formatCurrency(
                                planejadoPagar
                            )}
                        </span>
                    </div>
                )}

                {receber > 0 && (
                    <div className="alert-item">
                        <strong>Valores a receber</strong>

                        <span>
                            {formatCurrency(
                                planejadoReceber
                            )}
                        </span>
                    </div>
                )}

                {receber === 0 && pagar === 0 && (
                    <div className="alert-empty">
                        <p>
                            Nenhuma pendência no momento.
                        </p>
                    </div>
                )}

            </div>

        </section>
    );
}

export default Alerts;