document.addEventListener('DOMContentLoaded', () => {
    const kpiTotalDoadoresEl = document.getElementById('kpi-total-doadores');
    const kpiAgendamentosPendentesEl = document.getElementById('kpi-agendamentos-pendentes');
    const kpiAgendamentosHojeEl = document.getElementById('kpi-agendamentos-hoje');

    const CAMINHO_DOADORES_JSON = 'doadores.json';
    const CAMINHO_AGENDAMENTOS_JSON = 'agendamento.json';

    async function carregarDadosParaKPIs() {
        let doadores = [];
        let agendamentos = [];

        try {
            const respostaDoadores = await fetch(CAMINHO_DOADORES_JSON);
            if (!respostaDoadores.ok) {
                throw new Error(`Erro ao buscar doadores: ${respostaDoadores.status} ${respostaDoadores.statusText}`);
            }
            doadores = await respostaDoadores.json();

            const agendamentosGuardados = sessionStorage.getItem('agendamentosModificados');
            if (agendamentosGuardados) {
                console.log("DASHBOARD KPIs: Carregando agendamentos do sessionStorage.");
                try {
                    agendamentos = JSON.parse(agendamentosGuardados);
                } catch (parseError) {
                    console.error("DASHBOARD KPIs: Erro ao parsear agendamentos do sessionStorage:", parseError);
                    console.log("DASHBOARD KPIs: Fallback - Carregando agendamentos do arquivo JSON devido a erro de parse.");
                    const respostaAgendamentos = await fetch(CAMINHO_AGENDAMENTOS_JSON);
                    if (!respostaAgendamentos.ok) {
                        throw new Error(`Erro ao buscar agendamentos (fallback): ${respostaAgendamentos.status} ${respostaAgendamentos.statusText}`);
                    }
                    agendamentos = await respostaAgendamentos.json();
                    sessionStorage.setItem('agendamentosModificados', JSON.stringify(agendamentos));
                }
            } else {
                console.log("DASHBOARD KPIs: Carregando agendamentos do arquivo JSON (sessionStorage vazio).");
                const respostaAgendamentos = await fetch(CAMINHO_AGENDAMENTOS_JSON);
                if (!respostaAgendamentos.ok) {
                    throw new Error(`Erro ao buscar agendamentos: ${respostaAgendamentos.status} ${respostaAgendamentos.statusText}`);
                }
                agendamentos = await respostaAgendamentos.json();
                sessionStorage.setItem('agendamentosModificados', JSON.stringify(agendamentos));
            }

            calcularEExibirKPIs(doadores, agendamentos);

        } catch (error) {
            console.error("Falha ao carregar dados para KPIs:", error);
            if (kpiTotalDoadoresEl) kpiTotalDoadoresEl.textContent = "Erro";
            if (kpiAgendamentosPendentesEl) kpiAgendamentosPendentesEl.textContent = "Erro";
            if (kpiAgendamentosHojeEl) kpiAgendamentosHojeEl.textContent = "Erro";
        }
    }

    function calcularEExibirKPIs(doadores, agendamentos) {
        if (kpiTotalDoadoresEl && Array.isArray(doadores)) {
            kpiTotalDoadoresEl.textContent = doadores.length;
        }

        if (Array.isArray(agendamentos)) {
            const agendamentosPendentes = agendamentos.filter(ag => ag.status === "Pendente").length;
            if (kpiAgendamentosPendentesEl) {
                kpiAgendamentosPendentesEl.textContent = agendamentosPendentes;
            }

            const hoje = new Date();
            const dataHojeString = hoje.toISOString().split('T')[0];

            const agendamentosConfirmadosHoje = agendamentos.filter(ag =>
                ag.status === "Confirmado" &&
                ag.data_hora &&
                ag.data_hora.startsWith(dataHojeString)
            ).length;

            if (kpiAgendamentosHojeEl) {
                kpiAgendamentosHojeEl.textContent = agendamentosConfirmadosHoje;
            }
        }
    }

    if (kpiTotalDoadoresEl || kpiAgendamentosPendentesEl || kpiAgendamentosHojeEl) {
        carregarDadosParaKPIs();
    }
});