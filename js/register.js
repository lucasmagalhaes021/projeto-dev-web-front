// Importa a função para salvar o usuário
import { saveUser } from "./auth.js";

// Seleciona o formulário de cadastro
const form = document.querySelector("form");

// Função para obter os dados do formulário
const getFormData = () => {
  const cpf = document.getElementById("cpf").value;
  const nome = document.getElementById("firstName").value + " " + document.getElementById("lastName").value;
  const dataNascimento = document.getElementById("birthdayDate").value;
  const senha = document.getElementById("password").value;
  const rua = document.getElementById("rua").value;
  const numero = document.getElementById("numero").value;
  const complemento = document.getElementById("complemento").value;
  const bairro = document.getElementById("bairro").value;
  const cidade = document.getElementById("cidade").value;
  const uf = document.getElementById("uf").value;
  const cep = document.getElementById("cep").value;
  const ddd = document.getElementById("ddd").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("emailAddress").value;
  const role = document.getElementById("role").value;

  return {
    cpf,
    nome,
    senha,
    dataNascimento,
    endereco: { rua, numero, complemento, bairro, cidade, uf, cep },
    contato: { ddd, telefone, email },
    role,
  };
};

// Função para registrar um usuário
const registerUser = async (userData) => {
  const response = await fetch("http://localhost:8080/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response;
};

// Função para criar uma conta
const createAccount = async (cpf) => {
  const accountData = {
    cpf: cpf
  };
  const response = await fetch("http://localhost:8080/conta/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(accountData),
  });
  return response;
};

// Função para fazer login
const loginUser = async (cpf, senha) => {
  const loginData = { cpf, password: senha };
  const response = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),
  });
  return response;
};

// Evento de submissão do formulário
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = getFormData();

  try {
    const registerResponse = await registerUser({
      cpf: formData.cpf,
      nome: formData.nome,
      senha: formData.senha,
      dataNascimento: formData.dataNascimento,
      idEndereco: formData.endereco,
      idContato: formData.contato,
      role: formData.role,
    });

    if (registerResponse.status === 200) {
      console.log("Usuário registrado com sucesso");
      const accountResponse = await createAccount(formData.cpf);

      if (accountResponse.status === 201) {
        console.log("Conta criada com sucesso");
        const loginResponse = await loginUser(formData.cpf, formData.senha);

        if (loginResponse.status === 200) {
          const data = await loginResponse.json();
          if (data.token) {
            console.log("Login realizado com sucesso");
            saveUser(data);
            window.location.href = "../home.html";
          } else {
            alert("Token inválido. Tente novamente.");
          }
        } else {
          alert("Login inválido. Tente novamente.");
        }
      } else {
        alert("Falha na criação da conta. Tente novamente.");
      }
    } else {
      alert("Falha no registro do usuário. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro durante o processo: ", error);
    alert("Ocorreu um erro. Tente novamente mais tarde.");
  }
});
