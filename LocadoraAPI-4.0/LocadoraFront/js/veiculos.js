let veiculos = [];

async function carregarCombos() {

    const fabricantesResp =
        await apiFetch('/Fabricantes');

    const fabricantes =
        await fabricantesResp.json();

    const selectFabricante =
        document.getElementById("fabricante");

    selectFabricante.innerHTML = "";

    fabricantes.forEach(f => {

        selectFabricante.innerHTML += `
            <option value="${f.id}">
                ${f.nome}
            </option>
        `;
    });


    const categoriasResp =
        await apiFetch('/Categorias');

    const categorias =
        await categoriasResp.json();

    const selectCategoria =
        document.getElementById("categoria");

    selectCategoria.innerHTML = "";

    categorias.forEach(c => {

        selectCategoria.innerHTML += `
            <option value="${c.id}">
                ${c.nome}
            </option>
        `;
    });
}

async function listarVeiculos() {

    const response =
        await apiFetch('/Veiculos');

    veiculos =
        await response.json();

    preencherTabela(veiculos);
}

function preencherTabela(lista) {

    const tabela =
        document.getElementById("tabelaVeiculos");

    tabela.innerHTML = "";

    lista.forEach(v => {

        tabela.innerHTML += `
            <tr>

                <td>${v.id}</td>

                <td>${v.modelo}</td>

                <td>${v.anoFabricacao}</td>

                <td>${v.placa}</td>

                <td>${v.quilometragem}</td>

                <td>${v.fabricante.nome}</td>

                <td>${v.categoria.nome}</td>

                <td>

                    ${
                        v.disponivel
                        ? '<span class="badge bg-success">Disponível</span>'
                        : '<span class="badge bg-danger">Alugado</span>'
                    }

                </td>

                <td>

                    <button class="btn btn-warning btn-sm"
                        onclick="editarVeiculo(${v.id})">

                        Editar

                    </button>

                    <button class="btn btn-danger btn-sm"
                        onclick="excluirVeiculo(${v.id})">

                        Excluir

                    </button>

                </td>

            </tr>
        `;
    });
}

async function salvarVeiculo() {

    const veiculo = {

        modelo: document.getElementById("modelo").value,

        anoFabricacao: parseInt(
            document.getElementById("ano").value
        ),

        placa: document.getElementById("placa").value,

        quilometragem: parseInt(
            document.getElementById("quilometragem").value
        ),

        disponivel: true,

        fabricanteId: parseInt(
            document.getElementById("fabricante").value
        ),

        categoriaId: parseInt(
            document.getElementById("categoria").value
        )
    };

    const response =
        await apiFetch('/Veiculos','POST',veiculo);

    if(response.ok){

        alert("Veículo cadastrado!");

        limparFormulario();

        listarVeiculos();

    }else{

        alert("Erro ao cadastrar.");
    }
}

async function excluirVeiculo(id){

    if(!confirm("Deseja excluir este veículo?")){

        return;
    }

    const response =
        await apiFetch(`/Veiculos/${id}`,'DELETE');

    if(response.ok){

        alert("Veículo excluído!");

        listarVeiculos();

    }else{

        alert("Erro ao excluir.");
    }
}

function editarVeiculo(id){

    const v =
        veiculos.find(x => x.id === id);

    document.getElementById("modelo").value =
        v.modelo;

    document.getElementById("ano").value =
        v.anoFabricacao;

    document.getElementById("placa").value =
        v.placa;

    document.getElementById("quilometragem").value =
        v.quilometragem;

    document.getElementById("fabricante").value =
        v.fabricanteId;

    document.getElementById("categoria").value =
        v.categoriaId;

    const btn =
        document.getElementById("btnSalvarVeiculo");

    btn.innerText = "Atualizar";

    btn.onclick = () => atualizarVeiculo(id);
}

async function atualizarVeiculo(id){

    const veiculo = {

        id: id,

        modelo: document.getElementById("modelo").value,

        anoFabricacao: parseInt(
            document.getElementById("ano").value
        ),

        placa: document.getElementById("placa").value,

        quilometragem: parseInt(
            document.getElementById("quilometragem").value
        ),

        disponivel: true,

        fabricanteId: parseInt(
            document.getElementById("fabricante").value
        ),

        categoriaId: parseInt(
            document.getElementById("categoria").value
        )
    };

    const response =
        await apiFetch(`/Veiculos/${id}`,'PUT',veiculo);

    if(response.ok){

        alert("Veículo atualizado!");

        limparFormulario();

        listarVeiculos();

        const btn =
            document.getElementById("btnSalvarVeiculo");

        btn.innerText = "Salvar";

        btn.onclick = salvarVeiculo;

    }else{

        alert("Erro ao atualizar.");
    }
}

function filtrarVeiculos(){

    const modelo =
        document.getElementById("filtroModelo")
        .value
        .toLowerCase();

    const placa =
        document.getElementById("filtroPlaca")
        .value
        .toLowerCase();

    const filtrados =
        veiculos.filter(v =>

            v.modelo.toLowerCase().includes(modelo)

            &&

            v.placa.toLowerCase().includes(placa)
        );

    preencherTabela(filtrados);
}

function limparFormulario(){

    document.getElementById("modelo").value = "";

    document.getElementById("ano").value = "";

    document.getElementById("placa").value = "";

    document.getElementById("quilometragem").value = "";
}

carregarCombos();
listarVeiculos();