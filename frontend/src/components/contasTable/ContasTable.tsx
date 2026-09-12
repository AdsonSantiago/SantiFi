import type { Conta } from "../../../services/accountService";

interface ContasTableProps {
    contas: Conta[];
}

function ContasTable({ contas }: ContasTableProps) {
    if (contas.length === 0) {
        return (
            <div className="contas-table-empty">
                <h3>Nenhuma conta encontrada</h3>

                <p>
                    Cadastre sua primeira conta para começar
                    a acompanhar seus saldos.
                </p>
            </div>
        );
    }

    return (
        <div className="contas-table-wrapper">
            <table className="contas-table">
                <thead>
                    <tr>
                        <th>Conta</th>
                        <th>Tipo</th>
                        <th>Saldo inicial</th>
                        <th>Saldo atual</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {contas.map((conta) => (
                        <tr key={conta.id}>
                            <td>
                                <strong>{conta.nome}</strong>
                            </td>

                            <td>
                                {conta.tipo}
                            </td>

                            <td>
                                R$ {conta.saldo_inicial}
                            </td>

                            <td>
                                R$ {conta.saldo_atual}
                            </td>

                            <td>
                                <span
                                    className={
                                        conta.ativo
                                            ? "conta-status ativo"
                                            : "conta-status inativo"
                                    }
                                >
                                    {conta.ativo
                                        ? "Ativa"
                                        : "Inativa"}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ContasTable;