import { saveUser } from './auth.js';

// Função para gerenciar o login
async function handleLogin(event) {
    event.preventDefault(); // Previne o envio do formulário

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const response = await fetch('https://mocki.io/v1/69d4083b-063b-474c-a49a-44313a5ce00e');
        const data = await response.json();

        if (data.sucess) {
            saveUser(data); // Salva os dados do usuário no localStorage
            window.location.href = 'home.html'; // Redireciona para a página home
        } else {
            alert('Login inválido. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        alert('Ocorreu um erro. Tente novamente mais tarde.');
    }
}

// Associa o evento de login ao formulário
const loginForm = document.querySelector('#loginSection form');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}
