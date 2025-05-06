let todosOsAgendamentos = [];

document.addEventListener('DOMContentLoaded', () => {
    const corpoTabela = document.getElementById('corpo-tabela-agendamentos');
    const inputBuscaDoador = document.getElementById('busca-doador-ag');
    const inputFiltroData = document.getElementById('filtro-data-ag');
    const selectFiltroStatus = document.getElementById('filtro-status-ag');
    const selectFiltroHemocentro = document.getElementById('filtro-hemocentro-ag');

    async function carregarAgendamentos() {
        try {
            const response = await fetch('../html/agendamento.json'); 
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            todosOsAgendamentos = await response.json();
            popularFiltroHemocentros(); 
            exibirAgendamentos(todosOsAgendamentos);
        } catch (error) {
            console.error('Erro ao carregar dados dos agendamentos:', error);
            corpoTabela.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red;">Erro ao carregar agendamentos.</td></tr>`;
        }
    }

    function popularFiltroHemocentros() {
        const hemocentros = [...new Set(todosOsAgendamentos.map(ag => ag.hemocentro_nome))].sort();
        selectFiltroHemocentro.innerHTML = '<option value="">Todos</option>'; 
        hemocentros.forEach(nome => {
            if (nome) { 
                const option = document.createElement('option');
                option.value = nome;
                option.textContent = nome;
                selectFiltroHemocentro.appendChild(option);
            }
        });
    }

    function formatarDataHora(dataHoraISO) {
        if (!dataHoraISO) return { data: 'N/A', hora: 'N/A' };
        try {
            const dataObj = new Date(dataHoraISO);
            const dataFormatada = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            return { data: dataFormatada, hora: horaFormatada };
        } catch (e) {
            console.warn("Erro ao formatar data/hora:", dataHoraISO, e);
            return { data: dataHoraISO.substring(0,10), hora: dataHoraISO.substring(11,16) }; 
        }
    }

    function exibirAgendamentos(agendamentos) {
        corpoTabela.innerHTML = '';

        if (!Array.isArray(agendamentos) || agendamentos.length === 0) {
            corpoTabela.innerHTML = `<tr><td colspan="7" style="text-align: center;">Nenhum agendamento encontrado.</td></tr>`;
            return;
        }

        
        agendamentos.sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora));


        agendamentos.forEach(ag => {
            const tr = document.createElement('tr');
            const { data, hora } = formatarDataHora(ag.data_hora);

            let statusClasse = '';
            if (ag.status) { 
                 statusClasse = `status-${ag.status.toLowerCase().replace(' ', '-')}`;
            }


            let acoesHtml = '';
            if (ag.status === "Pendente") {
                acoesHtml += `<button class="botao-acao-ag botao-confirmar" onclick="atualizarStatusAgendamento('${ag.id_agendamento}', 'Confirmado')">Confirmar</button> `;
                acoesHtml += `<button class="botao-acao-ag botao-cancelar-ag" onclick="atualizarStatusAgendamento('${ag.id_agendamento}', 'Cancelado')">Cancelar</button>`;
            } else if (ag.status === "Confirmado") {
                acoesHtml += `<button class="botao-acao-ag botao-realizado" onclick="atualizarStatusAgendamento('${ag.id_agendamento}', 'Realizado')">Realizado</button> `;
                acoesHtml += `<button class="botao-acao-ag botao-cancelar-ag" onclick="atualizarStatusAgendamento('${ag.id_agendamento}', 'Cancelado')">Cancelar</button>`;
            } else {
                
                acoesHtml = 'N/A';
            }


            tr.innerHTML = `
                <td>${ag.id_agendamento || 'N/A'}</td>
                <td>${ag.nome_doador || 'N/A'}</td>
                <td>${data}</td>
                <td>${hora}</td>
                <td>${ag.hemocentro_nome || 'N/A'}</td>
                <td><span class="status-agendamento ${statusClasse}">${ag.status || 'N/A'}</span></td>
                <td>${acoesHtml}</td>
            `;
            corpoTabela.appendChild(tr);
        });
    }

    function filtrarAgendamentos() {
        const termoBusca = inputBuscaDoador.value.toLowerCase().trim();
        const dataFiltro = inputFiltroData.value; 
        const statusFiltro = selectFiltroStatus.value;
        const hemocentroFiltro = selectFiltroHemocentro.value;

        const agendamentosFiltrados = todosOsAgendamentos.filter(ag => {
            const nomeDoadorCorresponde = !termoBusca ||
                                         (ag.nome_doador && ag.nome_doador.toLowerCase().includes(termoBusca)) ||
                                         (ag.id_doador && ag.id_doador.toLowerCase().includes(termoBusca));

            const dataAgendamentoCorresponde = !dataFiltro || (ag.data_hora && ag.data_hora.startsWith(dataFiltro));
            const statusCorresponde = !statusFiltro || (ag.status && ag.status === statusFiltro);
            const hemocentroCorresponde = !hemocentroFiltro || (ag.hemocentro_nome && ag.hemocentro_nome === hemocentroFiltro);

            return nomeDoadorCorresponde && dataAgendamentoCorresponde && statusCorresponde && hemocentroCorresponde;
        });
        exibirAgendamentos(agendamentosFiltrados);
    }

    
    inputBuscaDoador.addEventListener('input', filtrarAgendamentos);
    inputFiltroData.addEventListener('change', filtrarAgendamentos);
    selectFiltroStatus.addEventListener('change', filtrarAgendamentos);
    selectFiltroHemocentro.addEventListener('change', filtrarAgendamentos);

    carregarAgendamentos();
}); 


function atualizarStatusAgendamento(idAgendamento, novoStatus) {
    const index = todosOsAgendamentos.findIndex(ag => ag.id_agendamento === idAgendamento);
    if (index > -1) {
        todosOsAgendamentos[index].status = novoStatus;

      
        document.getElementById('busca-doador-ag').dispatchEvent(new Event('input')); 

        alert(`Agendamento ${idAgendamento} atualizado para ${novoStatus} (Simulação)!`);
    } else {
        alert(`Erro: Agendamento com ID ${idAgendamento} não encontrado.`);
    }
    
}