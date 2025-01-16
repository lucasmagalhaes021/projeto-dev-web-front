// Seleciona o formulário de cadastro
const form = document.querySelector('form');

// Adiciona o evento de submissão ao formulário
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Impede o comportamento padrão de envio do formulário

  // Obtém os valores dos campos do formulário
  const cpf = document.getElementById('cpf').value;
  const nome = document.getElementById('firstName').value + " " + document.getElementById('lastName').value;
  const dataNascimento = document.getElementById('birthdayDate').value;
  const senha = document.getElementById('password').value;
  const rua = document.getElementById('rua').value;
  const numero = document.getElementById('numero').value;
  const complemento = document.getElementById('complemento').value;
  const bairro = document.getElementById('bairro').value;
  const cidade = document.getElementById('cidade').value;
  const uf = document.getElementById('uf').value;
  const cep = document.getElementById('cep').value;
  const ddd = document.getElementById('ddd').value;
  const telefone = document.getElementById('telefone').value;
  const email = document.getElementById('emailAddress').value;
  const role = document.getElementById('role').value;

  // Monta o body da requisição
  const body = {
    cpf: cpf,
    nome: nome,
    senha: senha,
    dataNascimento: dataNascimento,
    idEndereco: {
      rua: rua,
      numero: numero,
      complemento: complemento,
      bairro: bairro,
      cidade: cidade,
      uf: uf,
      cep: cep
    },
    idContato: {
      ddd: ddd,
      telefone: telefone,
      email: email
    },
    role: role
  };

  try {
    // Faz a chamada à API
    const response = await fetch('http://localhost:8080/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (response.status === 200) {
      // Exibe o toast de sucesso
      showToast('Cadastro realizado com sucesso!', 'success');
    } else {
      // Trata outros status
      const errorData = await response.json();
      showToast(`Erro: ${errorData.message || 'Não foi possível realizar o cadastro.'}`, 'error');
    }
  } catch (error) {
    // Trata erros de conexão
    showToast('Erro de conexão com o servidor.', 'error');
  }
});

// Função para exibir o toast
function showToast(message, type) {
 console.log('Entrou no Show Toast');
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-bg-${type === 'success' ? 'success' : 'danger'} border-0`;
  toast.role = 'alert';
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  document.body.appendChild(toast);

  const bootstrapToast = new bootstrap.Toast(toast);
  bootstrapToast.show();

  // Remove o toast após um tempo
  setTimeout(() => {
    toast.remove();
  }, 5000);
}
