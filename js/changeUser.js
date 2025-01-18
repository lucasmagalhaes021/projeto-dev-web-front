import { getUser } from './auth.js';
const USER_LOGGED_IN = getUser();

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
    document.getElementById('nome').value = user.conta.usuario.nome;
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
        id: 1, // Esse valor pode ser dinâmico conforme necessário
        cpf: document.getElementById('cpf').value,
        nome: document.getElementById('nome').value,
        dataNascimento: document.getElementById('birthdayDate').value || null,
        idEndereco: {
            id: 1, // Ajustar conforme necessário
            rua: document.getElementById('rua').value,
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value,
            bairro: document.getElementById('bairro').value,
            cidade: document.getElementById('cidade').value,
            uf: document.getElementById('uf').value,
            cep: document.getElementById('cep').value,
        },
        idContato: {
            id: 1, // Ajustar conforme necessário
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
                "Authorization": `Bearer ${USER_LOGGED_IN.token}`
            },
            body: JSON.stringify({ usuario }),
        });

        if (response.ok) {
            const data = await response.json();;
            const rawUserData = JSON.parse(localStorage.getItem('userLoggedIn'));
            let rawUserDataUpdated = rawUserData;        
            rawUserDataUpdated.conta[0].usuario.nome = data.nome;
            rawUserDataUpdated.conta[0].usuario.cpf = data.cpf;
            rawUserDataUpdated.conta[0].usuario.dataNascimento = data.dataNascimento;

            // Endereço
            rawUserDataUpdated.conta[0].usuario.idEndereco.rua = data.idEndereco.rua;
            rawUserDataUpdated.conta[0].usuario.idEndereco.numero = data.idEndereco.numero;
            rawUserDataUpdated.conta[0].usuario.idEndereco.complemento = data.idEndereco.complemento;
            rawUserDataUpdated.conta[0].usuario.idEndereco.bairro = data.idEndereco.bairro;
            rawUserDataUpdated.conta[0].usuario.idEndereco.cidade = data.idEndereco.cidade;
            rawUserDataUpdated.conta[0].usuario.idEndereco.uf = data.idEndereco.uf;
            rawUserDataUpdated.conta[0].usuario.idEndereco.cep = data.idEndereco.cep;

            // Contato
            rawUserDataUpdated.conta[0].usuario.idContato.ddd = data.idContato.ddd;
            rawUserDataUpdated.conta[0].usuario.idContato.telefone = data.idContato.telefone;
            rawUserDataUpdated.conta[0].usuario.idContato.email = data.idContato.email;

            localStorage.setItem('userLoggedIn', JSON.stringify(rawUserDataUpdated));
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
