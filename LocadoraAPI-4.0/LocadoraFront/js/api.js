const API_BASE = "http://localhost:5049/api";

async function apiFetch(endpoint, method = "GET", body = null) {

    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {

        const response = await fetch(
            `${API_BASE}${endpoint}`,
            options
        );

        console.log("STATUS:", response.status);

        if (!response.ok) {

            const erro = await response.text();

            console.log("ERRO COMPLETO:");
            console.log(erro);

            alert(erro);
        }

        return response;

    } catch (error) {

        console.error("Erro na requisição:", error);

        alert("Não foi possível conectar com a API.");

        throw error;
    }
}