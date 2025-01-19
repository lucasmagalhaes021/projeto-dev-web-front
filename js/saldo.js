import { isUserLoggedIn, getUser } from "./auth.js";
const USER_LOGGED_IN = getUser();
export async function fetchSaldo(id_conta) {

  try {
    const response = await fetch(
      `http://localhost:8080/conta/${id_conta}/saldo`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${USER_LOGGED_IN.token}`
        }
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
        "Authorization": `Bearer ${USER_LOGGED_IN.token}`
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
async function insertSaldoPix(valor, chave_pix) {
  try {
    const response = await fetch("http://localhost:8080/pix/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${USER_LOGGED_IN.token}`
      },
      body: JSON.stringify({
        valor : valor,
        chavePix: chave_pix,
        numeroContaOrigem: USER_LOGGED_IN.conta.numeroConta
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao realizar PIX: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Resultado da API:", data);
    return data;
  } catch (error) {
    console.error("Erro ao realizar PIX:", error);
    return null;
  }
}



async function pagarBoletoSaldoConta(num_boleto, num_conta) {
  try {
    const response = await fetch(
      "http://localhost:8080/deposito/pagarBoletoViaConta",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${USER_LOGGED_IN.token}`
        },
        body: JSON.stringify({
          boleto: num_boleto,
          numeroConta: num_conta,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao pagar Boleto: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Resultado da API de Pagar Boleto", data);
    return data;
  } catch (error) {
    console.error("Erro ao pagar boleto:", error);
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

// Associa o evento gerar Boleto
const transferenciaForm = document.querySelector("#transferenciaSection form");
if (transferenciaForm) {
  console.log("Entrou no transferenciaForm");
  transferenciaForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Previne a atualização da página

    // Captura os valores do formulário
    const contaDestinoInput = document.querySelector(
      "#depositoContaDestino"
    ).value;
    const valorInput = document.querySelector("#depositoValor");
    const valor = parseFloat(valorInput.value);
    console.log("contaDestinoInput: " + contaDestinoInput);

    if (isNaN(valor) || valor <= 0) {
      alert("Por favor, insira um valor válido.");
      return;
    }

    // Substitua este número pela lógica para capturar o número da conta, se necessário

    const user = getUser();
    const numeroConta = contaDestinoInput;

    // Chama a função insertSaldo
    try {
      const resultCreateBoleto = await insertSaldo(valor, numeroConta);

      if (resultCreateBoleto && resultCreateBoleto.response) {
        const result = await pagarBoletoSaldoConta(
          resultCreateBoleto.response,
          user.conta.numeroConta
        );
        if (result && result.response) {
          // Exibe o código do boleto na tela
          const container = document.querySelector(
            "#transferenciaSection .row"
          );
          let transferenciaSucessElement =
            document.querySelector("#mensagemSucesso");

          if (!transferenciaSucessElement) {
            // Cria o elemento para exibir a mensagem, se não existir
            transferenciaSucessElement = document.createElement("div");
            transferenciaSucessElement.id = "mensagemSucesso";
            transferenciaSucessElement.className = "alert alert-success mt-3";
            container.appendChild(transferenciaSucessElement);
          }

          transferenciaSucessElement.innerHTML = `<strong>${result.response}</strong><br>`;
        } else {
          alert("Erro ao realizar a transferência. Tente novamente.");
        }
      } else {
        alert("Erro ao realizar a transferência. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao processar o formulário:", error);
      alert("Ocorreu um erro. Verifique o console para mais detalhes.");
    }
  });
}


const pixForm = document.querySelector("#pixSection form");
if (pixForm) {
  console.log("Entrou no pixForm");
  pixForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Previne a atualização da página

    // Captura os valores do formulário
    const chavePixInput = document.querySelector("#chavePix").value;
    console.log('chavePixInput: ' + chavePixInput)
    console.log('USER_LOGGED_IN chavePixInput: ' + USER_LOGGED_IN.conta.chavePix.id)
    if ( chavePixInput === USER_LOGGED_IN.conta.chavePix.id) {
      console.error("Não é possivel fazer pix para você mesmo");
      alert("Não é possível realizar um PIX para você mesmo. Por favor, verifique os dados do destinatário e tente novamente.");
    return;
    }
    const valorInput = document.querySelector("#depositoValor");
    const valor = parseFloat(valorInput.value);
    console.log("chavePixInput: " + chavePixInput);

    if (isNaN(valor) || valor <= 0) {
      alert("Por favor, insira um valor válido.");
      return;
    }

    // Substitua este número pela lógica para capturar o número da conta, se necessário

    const user = getUser();
    const chavePix = chavePixInput;

    // Chama a função insertSaldo
    try {
      const resultPix = await insertSaldoPix(valor, chavePix);

      if (resultPix && resultPix.response) {
          // Exibe o código do boleto na tela
          const container = document.querySelector(
            "#pixSection .row"
          );
          let pixSucessElement =
            document.querySelector("#mensagemSucesso");

          if (!pixSucessElement) {
            // Cria o elemento para exibir a mensagem, se não existir
            pixSucessElement = document.createElement("div");
            pixSucessElement.id = "mensagemSucesso";
            pixSucessElement.className = "alert alert-success mt-3";
            container.appendChild(pixSucessElement);
          }

          pixSucessElement.innerHTML = `<strong>${resultPix.response}</strong><br>`;
      } else {
        alert("Erro ao realizar a transferência. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao processar o formulário:", error);
      alert("Ocorreu um erro. Verifique o console para mais detalhes.");
    }
  });
}
