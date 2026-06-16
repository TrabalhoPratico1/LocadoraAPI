let categorias = [];

async function listarCategorias() {

    const response = await apiFetch('/Categorias');

    categorias = await response.json();

    preencherTabela(categorias);
}

function preencherTabela(lista) {

    const tabela =
        document.getElementById("tabelaCategorias");

    tabela.innerHTML = "";

    lista.forEach(c => {

        tabela.innerHTML += `
            <tr>

                <td>${c.id}</td>

                <td>${c.nome}</td>

                <td>${c.descricao ?? ''}</td>

                <td>

                    <button class="btn btn-warning btn-sm"
                        onclick="editarCategoria(${c.id})">

                        Editar

                    </button>

                    <button class="btn btn-danger btn-sm"
                        onclick="excluirCategoria(${c.id})">

                        Excluir

                    </button>

                </td>

            </tr>
        `;
    });
}

async function salvarCategoria() {

    const categoria = {

        nome: document.getElementById("nome").value,

        descricao: document.getElementById("descricao").value
    };

    const response =
        await apiFetch('/Categorias','POST',categoria);

    if(response.ok){

        alert("Categoria cadastrada!");

        limparFormulario();

        listarCategorias();
    }
}

async function excluirCategoria(id){

    if(!confirm("Deseja excluir?")) return;

    const response =
        await apiFetch(`/Categorias/${id}`,'DELETE');

    if(response.ok){

        listarCategorias();
    }
}

function editarCategoria(id){

    const categoria =
        categorias.find(c => c.id === id);

    document.getElementById("nome").value =
        categoria.nome;

    document.getElementById("descricao").value =
        categoria.descricao;

    const btn =
        document.getElementById("btnSalvar");

    btn.innerText = "Atualizar";

    btn.onclick = () => atualizarCategoria(id);
}

async function atualizarCategoria(id){

    const categoria = {

        id:id,

        nome: document.getElementById("nome").value,

        descricao: document.getElementById("descricao").value
    };

    const response =
        await apiFetch(`/Categorias/${id}`,'PUT',categoria);

    if(response.ok){

        alert("Categoria atualizada!");

        limparFormulario();

        listarCategorias();

        const btn =
            document.getElementById("btnSalvar");

        btn.innerText = "Salvar";

        btn.onclick = salvarCategoria;
    }
}

function limparFormulario(){

    document.getElementById("nome").value = "";

    document.getElementById("descricao").value = "";
}

listarCategorias();