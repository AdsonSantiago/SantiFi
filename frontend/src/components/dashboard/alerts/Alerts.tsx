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
  const receber = Number(planejadoReceber) || 0;
  const pagar = Number(planejadoPagar) || 0;

  const hasAlerts = receber > 0 || pagar > 0;

  return (
    <section
      className="dashboard-card alerts-card"
      aria-labelledby="alerts-title"
    >
      <div className="card-header alerts-header">
        <div>
          <p className="alerts-eyebrow">ACOMPANHAMENTO</p>

          <h2 id="alerts-title">Alertas e pendências</h2>

          <p className="alerts-description">
            Valores previstos para o período.
          </p>
        </div>

        <span
          className={`alerts-status ${
            hasAlerts ? "has-alerts" : "all-clear"
          }`}
          aria-label={
            hasAlerts
              ? "Existem pendências financeiras"
              : "Nenhuma pendência financeira"
          }
        >
          <span aria-hidden="true">
            {hasAlerts ? "!" : "✓"}
          </span>
        </span>
      </div>

      {hasAlerts ? (
        <div className="alerts-list">
          {pagar > 0 && (
            <article className="alert-item alert-payment">
              <div className="alert-item-icon" aria-hidden="true">
                ↘
              </div>

              <div className="alert-item-content">
                <strong>Contas a pagar</strong>
                <span>Despesas planejadas</span>
              </div>

              <div className="alert-item-value">
                <strong>{formatCurrency(pagar)}</strong>
                <span>previsto</span>
              </div>
            </article>
          )}

          {receber > 0 && (
            <article className="alert-item alert-income">
              <div className="alert-item-icon" aria-hidden="true">
                ↗
              </div>

              <div className="alert-item-content">
                <strong>Valores a receber</strong>
                <span>Receitas planejadas</span>
              </div>

              <div className="alert-item-value">
                <strong>{formatCurrency(receber)}</strong>
                <span>previsto</span>
              </div>
            </article>
          )}
        </div>
      ) : (
        <div className="alert-empty" role="status">
          <div className="empty-icon" aria-hidden="true">
            ✓
          </div>

          <strong>Tudo em dia</strong>

          <p>Nenhuma pendência financeira no momento.</p>
        </div>
      )}

      {hasAlerts && (
        <div className="alerts-footer">
          <span className="alerts-footer-dot" aria-hidden="true" />
          Atualizado com os dados mais recentes
        </div>
      )}
    </section>
  );
}

export default Alerts;