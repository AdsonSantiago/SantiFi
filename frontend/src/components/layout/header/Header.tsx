import "./header.css"
function Header() {
    return (
        <header className="header">

            <span className="header-title">
                Controle Financeiro
            </span>

            <div className="header-actions">

                <span>
                    Este mês
                </span>

                <span>
                    👤 Usuário
                </span>

            </div>

        </header>
    );
}

export default Header;