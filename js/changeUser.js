import { getUser } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = getUser();
    if (user) {
        preencherFormulario(user);
    }
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
