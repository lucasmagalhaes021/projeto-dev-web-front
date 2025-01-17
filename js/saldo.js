import { isUserLoggedIn, getUser } from './auth.js';
export async function fetchSaldo(id_conta) {
  try {
    const response = await fetch(
      `http://localhost:8080/conta/${id_conta}/saldo`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar saldo: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("fetchSaldo: data >>" + data);
    return data; // Supondo que o saldo vem na propriedade "saldo"
  } catch (error) {
    console.error("Erro ao buscar saldo:", error);
    return null;
  }
}

export function updateSaldoHTML(saldo) {
  if (saldo !== null) {
    const saldoElement = document.querySelector("#homeSection .text-success");
    saldoElement.innerText = `R$ ${saldo.toFixed(2).replace(".", ",")}`;
  }
}

async function insertSaldo(valor, num_conta) {
  try {
    const response = await fetch("http://localhost:8080/deposito/gerarBoleto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        valor,
        numeroConta: num_conta,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao gerar boleto: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Resultado da API:", data);
    return data;
  } catch (error) {
    console.error("Erro ao gerar boleto:", error);
    return null;
  }
}

// Associa o evento gerar Boleto
const depositoForm = document.querySelector("#depositoSection form");
if (depositoForm) {
  console.log("Entrou no depositoForm");
  depositoForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Previne a atualização da página

    // Captura os valores do formulário
    const valorInput = document.querySelector("#depositoValor");
    const valor = parseFloat(valorInput.value);

    if (isNaN(valor) || valor <= 0) {
      alert("Por favor, insira um valor válido.");
      return;
    }

    // Substitua este número pela lógica para capturar o número da conta, se necessário

    const user = getUser();
    const numeroConta = user.conta.numeroConta;

    // Chama a função insertSaldo
    try {
      const result = await insertSaldo(valor, numeroConta);

      if (result && result.response) {
        // Exibe o código do boleto na tela
        const container = document.querySelector("#depositoSection .row");
        let boletoElement = document.querySelector("#codigoBoleto");

        if (!boletoElement) {
          // Cria o elemento para exibir o código, se não existir
          boletoElement = document.createElement("div");
          boletoElement.id = "codigoBoleto";
          boletoElement.className = "alert alert-success mt-3";
          container.appendChild(boletoElement);
        }

        boletoElement.innerHTML = `
                    <strong>Boleto gerado com sucesso!</strong><br>
                    Código do boleto: <code>${result.response}</code>
                `;
      } else {
        alert("Erro ao gerar boleto. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao processar o formulário:", error);
      alert("Ocorreu um erro. Verifique o console para mais detalhes.");
    }
  });
}
