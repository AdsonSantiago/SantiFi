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
        <div className={`kpi-card ${main ? "kpi-main" : ""}`}>

            <span className="kpi-title">
                {title}
            </span>

            <strong className="kpi-value">
                {value}
            </strong>

        </div>
    );
}

export default KpiCard;