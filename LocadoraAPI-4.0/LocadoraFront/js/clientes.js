let clientes = [];

window.onload = listarClientes;

async function listarClientes() {
    try {
        const response = await apiFetch('/Clientes');

        if (!response.ok) throw new Error("Erro ao listar clientes");

        clientes = await response.json();

        preencherTabela(clientes);

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar clientes");
    }
}

function preencherTabela(lista) {

    const tabela = document.getElementById("tabelaClientes");
    tabela.innerHTML = "";

    lista.forEach(cliente => {

        tabela.innerHTML += `
            <tr>
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.cpf}</td>
                <td>${cliente.email}</td>
                <td>R$ ${(Number(cliente.saldo || 0)).toFixed(2)}</td>

                <td>
                    <button class="btn btn-warning btn-sm"
                        onclick="editarCliente(${cliente.id})">
                        Editar
                    </button>

                    <button class="btn btn-danger btn-sm"
                        onclick="excluirCliente(${cliente.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}

async function salvarCliente() {

    try {

        const cliente = {
            nome: document.getElementById("nome").value,
            cpf: document.getElementById("cpf").value,
            email: document.getElementById("email").value,
            saldo: Number(document.getElementById("saldo").value || 0)
        };

        const response =
            await apiFetch('/Clientes', 'POST', cliente);

        if (!response.ok) {

            const erro = await response.text();

            console.error(erro);

            alert(erro);

            return;
        }

        alert("Cliente cadastrado com sucesso!");

        limparFormulario();

        listarClientes();

    } catch (error) {

        console.error(error);

        alert("Erro ao cadastrar cliente");
    }
}

async function excluirCliente(id) {

    if (!confirm("Deseja excluir?")) return;

    try {
        const response = await apiFetch(`/Clientes/${id}`, 'DELETE');

        if (!response.ok) throw new Error();

        alert("Cliente excluído!");
        listarClientes();

    } catch (error) {
        console.error(error);
        alert("Erro ao excluir");
    }
}

function editarCliente(id) {

    const cliente = clientes.find(c => c.id === id);

    document.getElementById("nome").value = cliente.nome;
    document.getElementById("cpf").value = cliente.cpf;
    document.getElementById("email").value = cliente.email;
    document.getElementById("saldo").value = cliente.saldo;

    const btn = document.getElementById("btnSalvar");

    btn.innerText = "Atualizar";

    btn.onclick = () => atualizarCliente(id);
}

async function atualizarCliente(id) {

    try {

        const cliente = {
            id: id,
            nome: document.getElementById("nome").value,
            cpf: document.getElementById("cpf").value,
            email: document.getElementById("email").value,
            saldo: Number(document.getElementById("saldo").value || 0)
        };

        const response =
            await apiFetch(`/Clientes/${id}`, 'PUT', cliente);

        if (!response.ok) {

            const erro = await response.text();

            alert(erro);

            return;
        }

        alert("Cliente atualizado!");

        limparFormulario();

        listarClientes();

        const btn =
            document.getElementById("btnSalvar");

        btn.innerText = "Salvar";

        btn.onclick = salvarCliente;

    } catch (error) {

        console.error(error);

        alert("Erro ao atualizar cliente");
    }
}

function filtrarClientes() {

    const nome = document.getElementById("filtroNome").value.toLowerCase();
    const cpf = document.getElementById("filtroCpf").value;

    const filtrados = clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(nome) &&
        cliente.cpf.includes(cpf)
    );

    preencherTabela(filtrados);
}

function limparFormulario() {

    document.getElementById("nome").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("email").value = "";
    document.getElementById("saldo").value = "";

    const btn = document.getElementById("btnSalvar");
    btn.innerText = "Salvar";
    btn.onclick = salvarCliente;
}