async function buscarVeiculosFabricante() {

    const nome =
        document.getElementById("fabricanteBusca").value;

    const response =
        await apiFetch(
            `/Relatorios/veiculos-por-fabricante?nomeFabricante=${nome}`
        );

    const dados = await response.json();

    const lista =
        document.getElementById("resultadoFabricante");

    lista.innerHTML = "";

    dados.forEach(v => {

        lista.innerHTML += `
            <li>
                ${v.modelo} - ${v.placa}
            </li>
        `;
    });
}

async function buscarAlugueisAtivos() {

    const response =
        await apiFetch('/Relatorios/alugueis-ativos');

    const dados = await response.json();

    const lista =
        document.getElementById("resultadoAtivos");

    lista.innerHTML = "";

    dados.forEach(a => {

        lista.innerHTML += `
            <li>
                ${a.cliente.nome}
                alugou
                ${a.veiculo.modelo}
            </li>
        `;
    });
}

async function buscarHistorico() {

    const cpf =
        document.getElementById("cpfBusca").value;

    const response =
        await apiFetch(
            `/Relatorios/historico-cliente/${cpf}`
        );

    const lista =
        document.getElementById("resultadoHistorico");

    lista.innerHTML = "";

    if (!response.ok) {

        lista.innerHTML =
            "<li>Nenhum aluguel encontrado.</li>";

        return;
    }

    const dados = await response.json();

    dados.forEach(a => {

        lista.innerHTML += `
            <li>

                ${a.veiculo.modelo}

                -

                ${new Date(a.dataInicio)
                    .toLocaleDateString()}

            </li>
        `;
    });
}

async function buscarDisponiveis() {

    const categoria =
        document.getElementById("categoriaBusca").value;

    const response =
        await apiFetch(
            `/Relatorios/veiculos-disponiveis-por-categoria?nomeCategoria=${categoria}`
        );

    const dados = await response.json();

    console.log("DADOS RECEBIDOS:");
    console.log(dados);

    const lista =
        document.getElementById("resultadoDisponiveis");

    lista.innerHTML = "";

    dados.forEach(v => {

        lista.innerHTML += `
            <li>
                ${v.modelo}
                -
                ${v.fabricante ? v.fabricante.nome : "Sem fabricante"}
            </li>
        `;
    });
}
async function buscarFaturamento() {

    const response =
        await apiFetch(
            '/Relatorios/faturamento-por-cliente'
        );

    const dados =
        await response.json();

    const tabela =
        document.getElementById("resultadoFaturamento");

    tabela.innerHTML = "";

    dados.forEach(item => {

        tabela.innerHTML += `
            <tr>

                <td>
                    ${item.clienteNome}
                </td>

                <td>
                    R$ ${Number(item.faturamentoTotal)
                        .toFixed(2)}
                </td>

            </tr>
        `;
    });
}