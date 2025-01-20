import { getUser } from "./auth.js";
import { fetchExtrato } from "./extrato.js";
const USER_LOGGED_IN = getUser();

document.addEventListener("DOMContentLoaded", function () {
    //Redireciona se o usuario não tiver acesso
    if (USER_LOGGED_IN.conta.usuario.role === "USER") {
        window.location.href = "../home.html";
    }
    const form = document.querySelector("form");
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const cpfValue = document.getElementById("cpfValue").value;
        if (!cpfValue) {
            alert("Por favor, insira um CPF válido.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/usuario/usuarioByCpf/${cpfValue}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${USER_LOGGED_IN.token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar dados. Verifique o CPF.");
            }

            const data = await response.json();
            displayUserData(data);
            const responseConta = await fetch(
                `http://localhost:8080/conta/contaByCpf/${cpfValue}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${USER_LOGGED_IN.token}`,
                    },
                }
            );
            const dataConta = await responseConta.json();

            const extrato = await fetchExtrato(dataConta[0].id, dataConta[0].numeroConta);
            updateExtratoHTML(extrato);
        } catch (error) {
            console.error("Erro:", error);
            alert("Falha ao buscar informações do usuário.");
        }
    });

    function displayUserData(data) {
        const container = document.createElement("div");
        container.className = "row mt-4";

        const userHTML = `
            <div class="col-md-12">
                <div class="d-flex p-2">
                    <h3 class="me-3">Dados do Usuário</h3>
                    <button id = "liveToastBtn" class="btn btn-primary" onclick="promoteAdmin(${data.cpf})">Promover a Admin</button>
                </div>
                <!-- Toast de sucesso -->
            <div class="toast-container position-fixed top-0 end-0 p-3">
                <div id="liveToast" class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            Usuário promovido com sucesso!
                        </div>
                        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <tbody>
                            <tr><th>ID</th><td>${data.id}</td></tr>
                            <tr><th>CPF</th><td>${data.cpf}</td></tr>
                            <tr><th>Nome</th><td>${data.nome}</td></tr>
                            <tr><th>Data de Nascimento</th><td>${formatDateToBR(data.dataNascimento)}</td></tr>
                            <tr><th>Perfil</th><td>${data.role}</td></tr>
                        </tbody>
                    </table>
                </div>
                <h4>Endereço</h4>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <tbody>
                            <tr><th>Rua</th><td>${data.idEndereco.rua}</td></tr>
                            <tr><th>Número</th><td>${data.idEndereco.numero}</td></tr>
                            <tr><th>Complemento</th><td>${data.idEndereco.complemento}</td></tr>
                            <tr><th>Bairro</th><td>${data.idEndereco.bairro}</td></tr>
                            <tr><th>Cidade</th><td>${data.idEndereco.cidade}</td></tr>
                            <tr><th>Estado</th><td>${data.idEndereco.uf}</td></tr>
                            <tr><th>CEP</th><td>${data.idEndereco.cep}</td></tr>
                        </tbody>
                    </table>
                </div>
                <h4>Contato</h4>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <tbody>
                            <tr><th>DDD</th><td>${data.idContato.ddd}</td></tr>
                            <tr><th>Telefone</th><td>${data.idContato.telefone}</td></tr>
                            <tr><th>Email</th><td>${data.idContato.email}</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = userHTML;

        // Localiza a seção de resultados e exibe os dados abaixo do botão
        const resultsSection = document.getElementById("results");
        resultsSection.innerHTML = ""; // Limpa resultados anteriores
        resultsSection.appendChild(container);
    }

    function updateExtratoHTML(extrato) {
        const container = document.createElement("div");
        container.className = "row mt-4";

        let extratoHTML = `
            <div class="col-md-12">
                <h3>Extrato de Transações</h3>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Tipo</th>
                                <th>Valor</th>
                                <th>Conta Origem</th>
                                <th>Conta Destino</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        if (extrato && extrato.length > 0) {
            extrato.sort(
                (a, b) => new Date(b.dataTransacao) - new Date(a.dataTransacao)
            );

            extrato.forEach((transacao) => {
                const dataTransacao = new Date(transacao.dataTransacao);
                const dataFormatada = `${dataTransacao.toLocaleDateString(
                    "pt-BR"
                )} ${dataTransacao.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}`;
                extratoHTML += `
                    <tr>
                        <td>${dataFormatada}</td>
                        <td>${transacao.tipoTransacao}</td>
                        <td class="${transacao.valor < 0 ? "text-danger" : "text-success"
                    }">
                            ${transacao.valor < 0 ? "- " : ""}R$ ${Math.abs(
                        transacao.valor
                    ).toFixed(2)}
                        </td>
                        <td>${transacao.contaOrigem || "-"}</td>
                        <td>${transacao.contaDestino || "-"}</td>
                    </tr>
                `;
            });
        } else {
            extratoHTML += `
                <tr>
                    <td colspan="5" class="text-center">Nenhuma transação encontrada.</td>
                </tr>
            `;
        }

        extratoHTML += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = extratoHTML;

        // Insere a tabela de extrato abaixo da seção de dados do usuário
        const resultsSection = document.getElementById("results");
        resultsSection.appendChild(container);
    }

    function formatDateToBR(dateString) {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return "Data inválida";
        }
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
});
async function promoteAdmin(cpfToPromote) {
    try {
        const response = await fetch(
            `http://localhost:8080/usuario/mudarRole/${cpfToPromote}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${USER_LOGGED_IN.token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Erro ao promover Usuario");
        }

        const data = await response.json();

        // Exibir toast de sucesso
        const toastEl = document.getElementById("liveToast");
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao promover úsuario");
    }
}
window.promoteAdmin = promoteAdmin;
