from apps.financeiro.queries.dashboard_query import DashboardQuery


class DashboardService:

    @staticmethod
    def resumo(usuario, periodo="month"):
        inicio, fim = DashboardQuery.intervalo_periodo(usuario, periodo)

        saldo = DashboardQuery.saldo_total(usuario)
        receitas, despesas = DashboardQuery.totais_movimentos(
            usuario,
            inicio,
            fim,
        )
        receber, pagar = DashboardQuery.totais_planejados(
            usuario,
            inicio,
            fim,
        )
        evolucao = DashboardQuery.evolucao(usuario, periodo, inicio, fim)
        movimentos_recentes = DashboardQuery.movimentos_recentes(
            usuario,
            inicio,
            fim,
        )

        return {
            "saldo_atual": saldo,
            "periodo": periodo,
            "data_inicio": inicio,
            "data_fim": fim,
            "receitas_periodo": receitas,
            "despesas_periodo": despesas,
            # Mantidos para compatibilidade com consumidores da resposta antiga.
            "receitas_mes": receitas,
            "despesas_mes": despesas,
            "saldo_mes": receitas - despesas,
            "planejado_receber": receber,
            "planejado_pagar": pagar,
            "saldo_previsto": saldo + receber - pagar,
            "evolucao": evolucao,
            "movimentos_recentes": movimentos_recentes,
        }
