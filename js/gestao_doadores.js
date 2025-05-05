let todosOsDoadores = [];

document.addEventListener('DOMContentLoaded', () => {
    const corpoTabela = document.getElementById('corpo-tabela-doadores');
    const inputBuscaNome = document.getElementById('busca-nome');
    const selectTipoSanguineo = document.getElementById('filtro-tipo-sanguineo');
    const editForm = document.getElementById('editForm');

    async function carregarDoadores() {
        try {
            const response = await fetch('doadores.json');
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            todosOsDoadores = await response.json();
            exibirDoadores(todosOsDoadores);
        } catch (error) {
            console.error('Erro ao carregar dados dos doadores:', error);
            corpoTabela.innerHTML = `<tr><td colspan="8" style="text-align: center; color: red;">Erro ao carregar dados. Verifique o console (F12).</td></tr>`;
        }
    }

    function exibirDoadores(doadores) {
        corpoTabela.innerHTML = '';

        if (!Array.isArray(doadores) || doadores.length === 0) {
            corpoTabela.innerHTML = `<tr><td colspan="8" style="text-align: center;">Nenhum doador encontrado.</td></tr>`;
            return;
        }

        doadores.forEach(doador => {
            const tr = document.createElement('tr');
            let dataFormatada = formatarData(doador.ultima_doacao);

            tr.innerHTML = `
                <td>${doador.id || 'N/A'}</td>
                <td>${doador.nome || 'N/A'}</td>
                <td>${doador.email || 'N/A'}</td>
                <td>${doador.telefone || 'N/A'}</td>
                <td>${doador.tipo_sanguineo || 'N/A'}</td>
                <td>${dataFormatada}</td>
                <td>${doador.cidade || 'N/A'}</td>
                <td>
                    <button class="botao-acao botao-detalhes" title="Ver Detalhes" onclick="verDetalhes('${doador.id}')">Ver</button>
                    <button class="botao-acao botao-editar" title="Editar" onclick="editarDoador('${doador.id}')">Editar</button>
                </td>
            `;
            corpoTabela.appendChild(tr);
        });
    }

    function filtrarDoadores() {
        const termoBusca = inputBuscaNome.value.toLowerCase().trim();
        const tipoSanguineoFiltro = selectTipoSanguineo.value;

        const doadoresFiltrados = todosOsDoadores.filter(doador => {
            const nomeCorresponde = doador.nome.toLowerCase().includes(termoBusca);
            const tipoSanguineoCorresponde = !tipoSanguineoFiltro || doador.tipo_sanguineo === tipoSanguineoFiltro;
            return nomeCorresponde && tipoSanguineoCorresponde;
        });
        exibirDoadores(doadoresFiltrados);
    }

    editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = document.getElementById('edit-id').value;
        const nome = document.getElementById('edit-nome').value;
        const email = document.getElementById('edit-email').value;
        const telefone = document.getElementById('edit-telefone').value;
        const tipo_sanguineo = document.getElementById('edit-tipo-sanguineo').value;
        const ultima_doacao = document.getElementById('edit-ultima-doacao').value;
        const cidade = document.getElementById('edit-cidade').value;

        const index = todosOsDoadores.findIndex(d => d.id === id);
        if (index > -1) {
            todosOsDoadores[index] = { id, nome, email, telefone, tipo_sanguineo, ultima_doacao, cidade };
            filtrarDoadores(); // Reexibe a tabela com dados atualizados
            fecharModal('editModal');
            alert('Doador atualizado com sucesso (Simulação)!');
        } else {
            alert('Erro ao encontrar doador para atualizar.');
        }
        // Em um sistema real, enviaria os dados para o backend aqui (fetch com PUT/POST)
    });

    inputBuscaNome.addEventListener('input', filtrarDoadores);
    selectTipoSanguineo.addEventListener('change', filtrarDoadores);

    carregarDoadores();
}); // Fim do DOMContentLoaded

function formatarData(dataString) {
    if (!dataString) return 'N/A';
    try {
        const [ano, mes, dia] = dataString.split('-');
        // Verifica se a divisão resultou em 3 partes
        if (ano && mes && dia && ano.length === 4 && mes.length === 2 && dia.length === 2) {
             return `${dia}/${mes}/${ano}`;
        } else {
            // Se formato for diferente, tenta parsear e formatar (mais robusto mas complexo)
            // Ou simplesmente retorna a string original se não for AAAA-MM-DD
            return dataString;
        }
    } catch (e) {
        console.warn("Erro ao formatar data:", dataString, e);
        return dataString; // Retorna original em caso de erro
    }
}

function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
    }
}

function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
    }
}

function verDetalhes(idDoador) {
    const doador = todosOsDoadores.find(d => d.id === idDoador);
    if (doador) {
        document.getElementById('view-id').textContent = doador.id || 'N/A';
        document.getElementById('view-nome').textContent = doador.nome || 'N/A';
        document.getElementById('view-email').textContent = doador.email || 'N/A';
        document.getElementById('view-telefone').textContent = doador.telefone || 'N/A';
        document.getElementById('view-tipo-sanguineo').textContent = doador.tipo_sanguineo || 'N/A';
        document.getElementById('view-ultima-doacao').textContent = formatarData(doador.ultima_doacao);
        document.getElementById('view-cidade').textContent = doador.cidade || 'N/A';
        abrirModal('viewModal');
    } else {
        alert(`Erro: Doador com ID ${idDoador} não encontrado.`);
    }
}

function editarDoador(idDoador) {
    const doador = todosOsDoadores.find(d => d.id === idDoador);
    if (doador) {
        document.getElementById('edit-id').value = doador.id || '';
        document.getElementById('edit-nome').value = doador.nome || '';
        document.getElementById('edit-email').value = doador.email || '';
        document.getElementById('edit-telefone').value = doador.telefone || '';
        document.getElementById('edit-tipo-sanguineo').value = doador.tipo_sanguineo || '';
        document.getElementById('edit-ultima-doacao').value = doador.ultima_doacao || ''; // Mantém AAAA-MM-DD para input date
        document.getElementById('edit-cidade').value = doador.cidade || '';
        abrirModal('editModal');
    } else {
        alert(`Erro: Doador com ID ${idDoador} não encontrado.`);
    }
}

// Fecha modal se clicar fora do conteúdo (opcional)
window.onclick = function(event) {
  const viewModal = document.getElementById('viewModal');
  const editModal = document.getElementById('editModal');
  if (event.target == viewModal) {
    fecharModal('viewModal');
  }
  if (event.target == editModal) {
     fecharModal('editModal');
  }
}