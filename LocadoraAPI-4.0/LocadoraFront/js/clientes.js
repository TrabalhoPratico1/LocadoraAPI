let clientes = [];

async function listarClientes() {

    const response = await apiFetch('/Clientes');

    clientes = await response.json();

    preencherTabela(clientes);
}

function preencherTabela(lista) {

    const tabela =
        document.getElementById("tabelaClientes");

    tabela.innerHTML = "";

    lista.forEach(cliente => {

        tabela.innerHTML += `
            <tr>

                <td>${cliente.id}</td>

                <td>${cliente.nome}</td>

                <td>${cliente.cpf}</td>

                <td>${cliente.email}</td>

                <td>
                    R$ ${cliente.saldo.toFixed(2)}
                </td>

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

    const cliente = {

        nome: document.getElementById("nome").value,

        cpf: document.getElementById("cpf").value,

        email: document.getElementById("email").value,

        saldo: parseFloat(
            document.getElementById("saldo").value
        )
    };

    const response =
        await apiFetch('/Clientes', 'POST', cliente);

    if (response.ok) {

        alert("Cliente cadastrado!");

        limparFormulario();

        listarClientes();

    } else {

        alert("Erro ao cadastrar.");
    }
}

async function excluirCliente(id) {

    if (!confirm("Deseja excluir?")) {

        return;
    }

    const response =
        await apiFetch(`/Clientes/${id}`, 'DELETE');

    if (response.ok) {

        alert("Cliente excluído!");

        listarClientes();

    } else {

        alert("Erro ao excluir.");
    }
}

function editarCliente(id) {

    const cliente =
        clientes.find(c => c.id === id);

    document.getElementById("nome").value =
        cliente.nome;

    document.getElementById("cpf").value =
        cliente.cpf;

    document.getElementById("email").value =
        cliente.email;

    document.getElementById("saldo").value =
        cliente.saldo;

    document.querySelector(".btn-primary")
        .innerText = "Atualizar";

    document.querySelector(".btn-primary")
        .onclick = () => atualizarCliente(id);
}

async function atualizarCliente(id) {

    const cliente = {

        id: id,

        nome: document.getElementById("nome").value,

        cpf: document.getElementById("cpf").value,

        email: document.getElementById("email").value,

        saldo: parseFloat(
            document.getElementById("saldo").value
        )
    };

    const response =
        await apiFetch(`/Clientes/${id}`, 'PUT', cliente);

    if (response.ok) {

        alert("Cliente atualizado!");

        limparFormulario();

        listarClientes();

        const botao =
            document.querySelector(".btn-primary");

        botao.innerText = "Salvar";

        botao.onclick = salvarCliente;

    } else {

        alert("Erro ao atualizar.");
    }
}

function filtrarClientes() {

    const nome =
        document.getElementById("filtroNome")
            .value.toLowerCase();

    const cpf =
        document.getElementById("filtroCpf")
            .value;

    const filtrados =
        clientes.filter(cliente =>

            cliente.nome.toLowerCase()
                .includes(nome)

            &&

            cliente.cpf.includes(cpf)
        );

    preencherTabela(filtrados);
}

function limparFormulario() {

    document.getElementById("nome").value = "";

    document.getElementById("cpf").value = "";

    document.getElementById("email").value = "";

    document.getElementById("saldo").value = "";
}

listarClientes();