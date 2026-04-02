// Configurações globais
const API_URL = "https://localhost:7158/api";
let modalFormularioBS = null;

// Inicializa modal ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    const modalElement = document.getElementById('modalFormulario');
    if (modalElement) {
        modalFormularioBS = new bootstrap.Modal(modalElement);
    }
});

// Funções de exibição

// Exibe dados em tabela
function exibirTabela(titulo, colunas, dados, tipoEntidade) {
    const app = document.getElementById('conteudo-principal');

    let html = `<h3>${titulo}</h3>`;
    html += `<button class="btn btn-success mb-4 shadow-sm" onclick="abrirFormulario(null, '${tipoEntidade}')">➕ Novo Cadastro</button>`;

    // Filtros para veículos
    if (tipoEntidade === 'Veiculos') {
        html += `
        <div class="row mb-4 filtro-container shadow-sm align-items-end">
            <div class="col-md-4">
                <label class="form-label fw-bold">Filtrar por Modelo:</label>
                <input type="text" id="filtro1" class="form-control" placeholder="Digite o modelo...">
            </div>
            <div class="col-md-4">
                <label class="form-label fw-bold">Filtrar por Placa:</label>
                <input type="text" id="filtro2" class="form-control" placeholder="Digite a placa...">
            </div>
            <div class="col-md-4">
                 <button class="btn btn-primary w-100" onclick="filtrar('${tipoEntidade}')">🔍 Pesquisar</button>
            </div>
        </div>`;
    }

    // Gera tabela ou mensagem vazia
    if (!dados || dados.length === 0) {
        html += `<div class="alert alert-info">Nenhum registro encontrado.</div>`;
    } else {
        html += `<div class="table-responsive"><table class="table table-hover table-bordered align-middle"><thead><tr>`;
        colunas.forEach(col => html += `<th>${col}</th>`);
        html += `<th class="text-center" style="width: 150px;">Ações</th></tr></thead><tbody>`;

        dados.forEach(item => {
            html += `<tr>`;
            // Exibe campos específicos por entidade
            if (tipoEntidade === 'Veiculos') {
                html += `<td>${item.id}</td>
                         <td><strong>${item.modelo}</strong></td>
                         <td>${item.anoFabricacao}</td>
                         <td><span class="badge bg-light text-dark border">${item.placa}</span></td>
                         <td>${item.quilometragem} km</td>
                         <td>${item.disponivel ? '<span class="badge bg-success">Sim</span>' : '<span class="badge bg-danger">Não</span>'}</td>
                         <td>${item.fabricante ? item.fabricante.nome : item.fabricanteId}</td>
                         <td>${item.categoria ? item.categoria.nome : item.categoriaId}</td>`;
            } else if (tipoEntidade === 'Clientes') {
                html += `<td>${item.id}</td>
                         <td><strong>${item.nome}</strong></td>
                         <td>${item.cpf}</td>
                         <td>${item.email}</td>
                         <td class="fw-bold text-success">R$ ${item.saldo ? item.saldo.toFixed(2) : '0.00'}</td>`;
            }

            // Botões de ação
            html += `<td class="text-center">
                        ${tipoEntidade === 'Clientes' ? `<button class="btn btn-sm btn-outline-success" title="Recarregar Saldo" onclick="abrirModalRecarga(${item.id})">💲</button>` : ''}
                        <button class="btn btn-sm btn-outline-primary" title="Editar" onclick="abrirFormulario(${item.id}, '${tipoEntidade}')">✏️</button>
                        <button class="btn btn-sm btn-outline-danger" title="Excluir" onclick="excluir(${item.id}, '${tipoEntidade}')">🗑️</button>
                     </td>`;
            html += `</tr>`;
        });
        html += `</tbody></table></div>`;
    }
    app.innerHTML = html;
}

// Funções de carregamento de dados

// Carrega veículos
async function carregarVeiculos() {
    try {
        document.getElementById('conteudo-principal').innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-primary"></div><p>Carregando veículos...</p></div>';
        const response = await fetch(`${API_URL}/Veiculos`);
        const veiculos = await response.json();
        exibirTabela('Gerenciar Veículos', ['ID', 'Modelo', 'Ano', 'Placa', 'KM', 'Disp.', 'Fabricante', 'Categoria'], veiculos, 'Veiculos');
    } catch (error) {
        alert("Erro ao carregar veículos. Verifique se a API está rodando.\n" + error);
    }
}

// Carrega clientes
async function carregarClientes() {
    try {
        document.getElementById('conteudo-principal').innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-primary"></div><p>Carregando clientes...</p></div>';
        const response = await fetch(`${API_URL}/Clientes`);
        const clientes = await response.json();
        exibirTabela('Gerenciar Clientes', ['ID', 'Nome', 'CPF', 'E-mail', 'Saldo Atual'], clientes, 'Clientes');
    } catch (error) { console.error(error); alert("Erro ao carregar clientes."); }
}

// Funções de formulário

// Busca dados para dropdowns
async function fetchParaSelect(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`);
        return await response.json();
    } catch (e) { return []; }
}

// Abre modal de formulário
async function abrirFormulario(id, tipoEntidade) {
    const modalTitle = document.getElementById('modalTitulo');
    const modalBody = document.getElementById('modalCorpoFormulario');
    const btnSalvar = document.getElementById('btnSalvarModal');

    modalTitle.innerText = (id ? 'Editar ' : 'Cadastrar Novo ') + tipoEntidade.slice(0, -1);
    modalBody.innerHTML = '<div class="text-center"><div class="spinner-border text-primary"></div><p>Carregando formulário...</p></div>';

    modalFormularioBS.show();

    let dadosEdicao = null;
    let htmlForm = '';

    try {
        // Busca dados para edição
        if (id) {
            const response = await fetch(`${API_URL}/${tipoEntidade}/${id}`);
            if (!response.ok) throw new Error('Erro ao buscar dados para edição.');
            dadosEdicao = await response.json();
        }

        // Constrói formulário para veículos
        if (tipoEntidade === 'Veiculos') {
            const fabricantes = await fetchParaSelect('Fabricantes');
            const categorias = await fetchParaSelect('Categorias');

            htmlForm = `
            <form id="form${tipoEntidade}">
                <input type="hidden" id="veiculoId" value="${id || ''}">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Modelo*</label>
                        <input type="text" class="form-control" id="modelo" value="${dadosEdicao?.modelo || ''}" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Placa*</label>
                        <input type="text" class="form-control" id="placa" value="${dadosEdicao?.placa || ''}" required ${id ? 'disabled' : ''}>
                    </div>
                     <div class="col-md-4">
                        <label class="form-label">Ano*</label>
                        <input type="number" class="form-control" id="ano" value="${dadosEdicao?.anoFabricacao || new Date().getFullYear()}" required>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Quilometragem*</label>
                        <input type="number" class="form-control" id="km" value="${dadosEdicao?.quilometragem || 0}" required>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Disponível?</label>
                        <select class="form-select" id="disponivel">
                            <option value="true" ${dadosEdicao?.disponivel !== false ? 'selected' : ''}>Sim</option>
                            <option value="false" ${dadosEdicao?.disponivel === false ? 'selected' : ''}>Não</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Fabricante*</label>
                        <select class="form-select" id="fabricanteId" required>
                            <option value="">Selecione...</option>
                            ${fabricantes.map(f => `<option value="${f.id}" ${dadosEdicao?.fabricanteId === f.id ? 'selected' : ''}>${f.nome}</option>`).join('')}
                        </select>
                    </div>
                     <div class="col-md-6">
                        <label class="form-label">Categoria*</label>
                        <select class="form-select" id="categoriaId" required>
                            <option value="">Selecione...</option>
                            ${categorias.map(c => `<option value="${c.id}" ${dadosEdicao?.categoriaId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </form>`;

        } else if (tipoEntidade === 'Clientes') {
            htmlForm = `
            <form id="form${tipoEntidade}">
                <input type="hidden" id="clienteId" value="${id || ''}">
                <input type="hidden" id="saldoAtual" value="${dadosEdicao?.saldo || 0}">
                <div class="mb-3">
                    <label class="form-label">Nome Completo*</label>
                    <input type="text" class="form-control" id="nome" value="${dadosEdicao?.nome || ''}" required>
                </div>
                 <div class="row g-3">
                    <div class="col-md-6">
                         <label class="form-label">CPF*</label>
                         <input type="text" class="form-control" id="cpf" value="${dadosEdicao?.cpf || ''}" required ${id ? 'disabled' : ''} maxlength="11">
                    </div>
                    <div class="col-md-6">
                         <label class="form-label">Telefone</label>`;