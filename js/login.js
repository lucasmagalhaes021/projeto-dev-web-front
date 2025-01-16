import { saveUser } from "./auth.js";


// Função para gerenciar o login
async function handleLogin(event) {
  event.preventDefault(); // Previne o envio do formulário

  const cpf = document.getElementById("loginCPF").value;
  const password = document.getElementById("loginPassword").value;

  if (!cpf || !password) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Remove máscara do CPF (deixa apenas os números)
  const cpfClean = cpf.replace(/\D/g, "");

  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cpf: cpfClean,
        password: password,
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      if (data.token) {
        saveUser(data); // Salva os dados do usuário no localStorage
        window.location.href = "home.html"; // Redireciona para a página home
      } else {
        alert("Token inválido. Tente novamente.");
      }
    } else {
      alert("Login inválido. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    alert("Ocorreu um erro. Tente novamente mais tarde.");
  }
}




// Associa o evento de login ao formulário
const loginForm = document.querySelector("#loginSection form");
if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

document.addEventListener("DOMContentLoaded", () => {
  const cpfInput = document.getElementById("loginCPF");
  const cpfErrorToast = document.getElementById("cpfErrorToast");

  // Função para aplicar máscara de CPF
  function aplicarMascaraCPF(value) {
    return value
      .replace(/\D/g, "") // Remove caracteres não numéricos
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  // Função para validar CPF
  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
  }

  // Função para exibir o toast de erro
  function mostrarToastErro() {
    cpfErrorToast.style.display = "block";
    cpfErrorToast.classList.add("show");

    // Ocultar automaticamente após 3 segundos
    setTimeout(() => {
      cpfErrorToast.classList.remove("show");
      cpfErrorToast.style.display = "none";
    }, 3000);
  }

  // Aplicar máscara enquanto o usuário digita
  cpfInput.addEventListener("input", (event) => {
    const value = event.target.value;
    event.target.value = aplicarMascaraCPF(value);
  });

  // Validar CPF ao perder o foco
  cpfInput.addEventListener("blur", () => {
    const cpf = cpfInput.value;
    if (!validarCPF(cpf)) {
      mostrarToastErro();
      cpfInput.value = ""; // Limpa o campo se o CPF for inválido
    }
  });
});

// Bootstrap validation handler
document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
});
