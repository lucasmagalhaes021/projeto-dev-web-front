import { getUser } from './auth.js';
import { saveUser, loginAPI } from "./auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const user = getUser();
    if (user) {
        preencherFormulario(user);
    }

    // Adiciona evento ao botão "Alterar"
    document.querySelector('input[type="submit"]').addEventListener('click', (event) => {
        event.preventDefault(); // Previne envio padrão do formulário
        atualizarUsuario();
    });
});

function preencherFormulario(user) {
    // Preencher campos de usuário
    document.getElementById('firstName').value = user.conta.usuario.nome;
    document.getElementById('lastName').value = user.conta.usuario.sobrenome;
    document.getElementById('birthdayDate').value = user.conta.usuario.dataNascimento;
    document.getElementById('cpf').value = user.conta.usuario.cpf;
    document.getElementById('role').value = user.conta.usuario.role;

    // Preencher endereço
    const endereco = user.conta.usuario.endereco;
    document.getElementById('rua').value = endereco.rua;
    document.getElementById('numero').value = endereco.numero;
    document.getElementById('complemento').value = endereco.complemento;
    document.getElementById('bairro').value = endereco.bairro;
    document.getElementById('cidade').value = endereco.cidade;
    document.getElementById('uf').value = endereco.uf;
    document.getElementById('cep').value = endereco.cep;

    // Preencher contato
    const contato = user.conta.usuario.contato;
    document.getElementById('ddd').value = contato.ddd;
    document.getElementById('telefone').value = contato.telefone;
    document.getElementById('emailAddress').value = contato.email;
}

async function atualizarUsuario() {
    // Capturar dados do formulário
    const usuario = {
        id: 12, // Esse valor pode ser dinâmico conforme necessário
        cpf: document.getElementById('cpf').value,
        nome: document.getElementById('firstName').value,
        dataNascimento: document.getElementById('birthdayDate').value || null,
        idEndereco: {
            id: 12, // Ajustar conforme necessário
            rua: document.getElementById('rua').value,
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value,
            bairro: document.getElementById('bairro').value,
            cidade: document.getElementById('cidade').value,
            uf: document.getElementById('uf').value,
            cep: document.getElementById('cep').value,
        },
        idContato: {
            id: 12, // Ajustar conforme necessário
            ddd: document.getElementById('ddd').value,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('emailAddress').value,
        },
        role: document.getElementById('role').value,
    };

    try {
        const response = await fetch('http://localhost:8080/usuario/updateUsuario', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario }),
        });

        if (response.ok) {
            const data = await response.json();
            //const user = getUser();
            var rawUserData = JSON.parse(localStorage.getItem('userLoggedIn'));
            rawUserData.conta?.[0].usuario.nome = data.nome;
            localStorage.setItem('userLoggedIn', JSON.stringify(rawUserData));
            //console.log('Nome Storage: >> ' + rawUserData.conta?.[0].usuario.nome);
            //console.log('nome Atualizado: >> ' + data.nome);
            alert('Dados atualizados com sucesso!');
            
        } else {
            const error = await response.json();
            alert(`Erro ao atualizar os dados: ${error.message}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor.');
    }
}
