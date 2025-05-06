# Projeto Doe Vida - Sistema de Gerenciamento para Hemocentros (Frontend)

## Visão Geral do Projeto

Este projeto visa criar uma interface frontend para um sistema de doação de sangue. O objetivo é facilitar a conexão entre doadores, pacientes e profissionais de hemocentros, incentivando a doação e otimizando a gestão. Atualmente, o foco está na construção das interfaces e simulação de funcionalidades utilizando HTML, CSS e JavaScript (client-side), com dados fictícios carregados de arquivos JSON.

## Progresso em 06 de Maio de 2025

O trabalho de hoje concentrou-se em expandir as funcionalidades do painel profissional e implementar interações dinâmicas com os dados.

### 1. Páginas de Login e Cadastro de Cliente (`login.html`, `cadastro_cliente.html`)
* Estrutura HTML e CSS básica para as telas de login (separando acesso do profissional e doador/paciente) e cadastro de cliente.
* Implementação de uma **simulação de login para Profissionais** no `login.html` usando JavaScript:
    * Uma senha de administrador fixa (`SENHA_ADMIN_CORRETA = "admin123"` no `login_controller.js`) é verificada no lado do cliente.
    * Se correta, o usuário é redirecionado para `espacoProfissional.html`.
    * **Nota:** Esta é uma implementação client-side **insegura**, apenas para fins de demonstração do fluxo durante o desenvolvimento frontend.

### 2. Espaço do Profissional (`espacoProfissional.html` - Dashboard)
* Estrutura de cards para navegação para diferentes módulos de gestão.
* **Implementação de KPIs (Key Performance Indicators) Dinâmicos:**
    * O script `dashboard_controller.js` busca dados dos arquivos `doadores.json` e `agendamento.json` (ou `agendamentos.json`).
    * Calcula e exibe no dashboard:
        * Total de Doadores Cadastrados.
        * Total de Agendamentos Pendentes.
        * Total de Agendamentos Confirmados para Hoje.
    * Os caminhos para os arquivos JSON foram ajustados para refletir a estrutura de pastas atual.

### 3. Gestão de Doadores (`gestao_doadores.html`)
* Carregamento dinâmico de dados de `doadores.json` e exibição em uma tabela HTML.
* Filtros client-side por nome e tipo sanguíneo.
* Implementação das ações "Ver Detalhes" e "Editar Doador" utilizando modais (janelas popup):
    * "Ver": Exibe os dados completos do doador no modal.
    * "Editar": Abre um formulário no modal preenchido com os dados do doador. A ação de "Salvar" é simulada e atualiza os dados apenas no array JavaScript local (perdido ao recarregar a página).

### 4. Gerenciamento de Agendamentos (`gerenciamento_agendamentos.html`)
* Carregamento dinâmico de dados de `agendamento.json` (ou `agendamentos.json`) e exibição em tabela.
* Filtros client-side por nome/ID do doador, data, status e hemocentro.
* Estilização visual para diferentes status de agendamento (Pendente, Confirmado, etc.).
* **Simulação de Ações:**
    * Botões para "Confirmar", "Cancelar", "Marcar como Realizado" um agendamento.
    * Essas ações atualizam o status do agendamento no array JavaScript local e redesenham a tabela para refletir a mudança.

### 5. Tentativa de Atualização Dinâmica dos KPIs entre Páginas (Usando `sessionStorage`)
* **Objetivo:** Fazer com que as alterações de status realizadas na página "Gerenciamento de Agendamentos" reflitam nos KPIs da página "Espaço do Profissional" (Dashboard) durante a mesma sessão do navegador.
    
* **Implementação:**
    * `gerenciamento_agendamentos.js`: Após uma atualização de status, salva a lista completa de agendamentos modificada no `sessionStorage`.
    * `dashboard_controller.js`: Ao carregar, tenta ler a lista de agendamentos do `sessionStorage`. Se não encontrar, busca do arquivo JSON e salva essa versão inicial no `sessionStorage`.
* **Status Atual (06/05/2025):** Estamos no processo de depuração desta funcionalidade. Aparentemente, a gravação no `sessionStorage` a partir da página de gerenciamento de agendamentos não está ocorrendo como esperado, pois o dashboard não reflete as alterações. O `sessionStorage` aparece vazio na aba "Application" quando inspecionado na página de gerenciamento após uma ação. A investigação continua focada em `gerenciamento_agendamentos.js` para garantir que `sessionStorage.setItem()` seja chamado corretamente com os dados atualizados.

## Tecnologias Utilizadas (Frontend)
* HTML5
* CSS3
* JavaScript (ES6+)
* Dados fictícios via arquivos JSON.

## Notas de Desenvolvimento e Desafios Atuais
* Todas as interações de dados (salvar, editar, excluir) são atualmente **simulações client-side**. Não há persistência de dados real, pois não há backend implementado.
* O principal desafio no momento é garantir que a atualização dos KPIs no dashboard via `sessionStorage` funcione corretamente após ações na página de gerenciamento de agendamentos.

## Próximos Passos (Geral)
* Finalizar a depuração da atualização de KPIs via `sessionStorage`.
* Continuar o desenvolvimento dos módulos placeholder (Controle de Estoque, Comunicação, Relatórios) com simulações client-side.
* Refinar a interface e a experiência do usuário.
* Planejar a arquitetura e implementação de um backend para funcionalidades reais.