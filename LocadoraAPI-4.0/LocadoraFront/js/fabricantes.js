let fabricantes = [];

async function listarFabricantes(){

    const response =
        await apiFetch('/Fabricantes');

    fabricantes =
        await response.json();

    preencherTabela(fabricantes);
}

function preencherTabela(lista){

    const tabela =
        document.getElementById("tabelaFabricantes");

    tabela.innerHTML = "";

    lista.forEach(f => {

        tabela.innerHTML += `
            <tr>

                <td>${f.id}</td>

                <td>${f.nome}</td>

                <td>

                    <button class="btn btn-warning btn-sm"
                        onclick="editarFabricante(${f.id})">

                        Editar

                    </button>

                    <button class="btn btn-danger btn-sm"
                        onclick="excluirFabricante(${f.id})">

                        Excluir

                    </button>

                </td>

            </tr>
        `;
    });
}

async function salvarFabricante(){

    const fabricante = {

        nome: document.getElementById("nome").value
    };

    const response =
        await apiFetch('/Fabricantes','POST',fabricante);

    if(response.ok){

        alert("Fabricante cadastrado!");

        limparFormulario();

        listarFabricantes();
    }
}

async function excluirFabricante(id){

    if(!confirm("Deseja excluir?")) return;

    const response =
        await apiFetch(`/Fabricantes/${id}`,'DELETE');

    if(response.ok){

        listarFabricantes();
    }
}

function editarFabricante(id){

    const fabricante =
        fabricantes.find(f => f.id === id);

    document.getElementById("nome").value =
        fabricante.nome;

    const btn =
        document.getElementById("btnSalvar");

    btn.innerText = "Atualizar";

    btn.onclick = () => atualizarFabricante(id);
}

async function atualizarFabricante(id){

    const fabricante = {

        id:id,

        nome: document.getElementById("nome").value
    };

    const response =
        await apiFetch(`/Fabricantes/${id}`,'PUT',fabricante);

    if(response.ok){

        alert("Fabricante atualizado!");

        limparFormulario();

        listarFabricantes();

        const btn =
            document.getElementById("btnSalvar");

        btn.innerText = "Salvar";

        btn.onclick = salvarFabricante;
    }
}

function limparFormulario(){

    document.getElementById("nome").value = "";
}

listarFabricantes();