import "./kpicard-style.css";

interface KpiCardProps {
  title: string;
  value: string;
  main?: boolean;
}

function KpiCard({
  title,
  value,
  main = false,
}: KpiCardProps) {
  return (
    <article className={`kpi-card ${main ? "kpi-main" : ""}`}>
      <div className="kpi-card-top">
        <span className="kpi-title">{title}</span>

        <span className="kpi-indicator" aria-hidden="true">
          {main ? "◆" : "◈"}
        </span>
      </div>

      <strong className="kpi-value">{value}</strong>

      <span className="kpi-caption">
        {main ? "Saldo disponível" : "Referente ao período selecionado"}
      </span>
    </article>
  );
}

export default KpiCard;