let alugueis = [];

async function carregarCombos() {

    const clientesResp = await apiFetch('/Clientes');
    const clientes = await clientesResp.json();

    const clienteSelect =
        document.getElementById("cliente");

    clienteSelect.innerHTML = "";

    clientes.forEach(c => {

        clienteSelect.innerHTML += `
            <option value="${c.id}">
                ${c.nome} (Saldo: R$ ${c.saldo})
            </option>
        `;
    });


    const veiculosResp = await apiFetch('/Veiculos');
    const veiculos = await veiculosResp.json();

    const veiculoSelect =
        document.getElementById("veiculo");

    veiculoSelect.innerHTML = "";

    veiculos
        .filter(v => v.disponivel)
        .forEach(v => {

            veiculoSelect.innerHTML += `
                <option value="${v.id}">
                    ${v.modelo} - ${v.placa}
                </option>
            `;
        });
}

async function listarAlugueis() {

    const response =
        await apiFetch('/Alugueis');

    alugueis =
        await response.json();

    preencherTabela();
}

function preencherTabela() {

    const tabela =
        document.getElementById("tabelaAlugueis");

    tabela.innerHTML = "";

    alugueis.forEach(a => {

        tabela.innerHTML += `
            <tr>

                <td>${a.id}</td>

                <td>${a.cliente.nome}</td>

                <td>${a.veiculo.modelo}</td>

                <td>
                    ${new Date(a.dataInicio)
                    .toLocaleDateString()}
                </td>

                <td>
                    ${
                        a.dataDevolucaoReal
                        ? new Date(a.dataDevolucaoReal)
                        .toLocaleDateString()
                        : '-'
                    }
                </td>

                <td>
                    ${
                        a.valorTotal
                        ? 'R$ ' + a.valorTotal
                        : '-'
                    }
                </td>

                <td>

                    ${
                        a.dataDevolucaoReal
                        ? '<span class="badge bg-success">Finalizado</span>'
                        : '<span class="badge bg-warning">Ativo</span>'
                    }

                </td>

                <td>

                    ${
                        !a.dataDevolucaoReal
                        ? `
                        <button class="btn btn-success btn-sm"
                            onclick="devolver(${a.id})">

                            Devolver

                        </button>
                        `
                        : ''
                    }

                    <button class="btn btn-danger btn-sm"
                        onclick="excluir(${a.id})">

                        Excluir

                    </button>

                </td>

            </tr>
        `;
    });
}

async function salvarAluguel() {

    const aluguel = {

        clienteId: parseInt(
            document.getElementById("cliente").value
        ),

        veiculoId: parseInt(
            document.getElementById("veiculo").value
        ),

        valorDiaria: parseFloat(
            document.getElementById("valorDiaria").value
        )
    };

    const response =
        await apiFetch('/Alugueis','POST',aluguel);

    if(response.ok){

        alert("Aluguel realizado!");

        listarAlugueis();

        carregarCombos();

    } else {

        const erro = await response.text();

        alert(erro);
    }
}

async function devolver(id){

    const km = prompt(
        "Informe a quilometragem final:"
    );

    if(km === null) return;

    const response =
        await apiFetch(
            `/Alugueis/${id}/devolucao`,
            'PUT',
            parseInt(km)
        );

    if(response.ok){

        alert("Veículo devolvido!");

        listarAlugueis();

        carregarCombos();

    } else {

        const erro = await response.text();

        alert(erro);
    }
}

async function excluir(id){

    if(!confirm("Deseja excluir?")){

        return;
    }

    const response =
        await apiFetch(`/Alugueis/${id}`,'DELETE');

    if(response.ok){

        listarAlugueis();

        carregarCombos();
    }
}

carregarCombos();
listarAlugueis();