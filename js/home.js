import { isUserLoggedIn, getUser } from './auth.js';

// Função para mostrar um toast de erro
function showErrorToast() {
    const toastContainer = document.createElement('div');
    toastContainer.innerHTML = `
    <div class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 20px; right: 20px; z-index: 1050;">
      <div class="d-flex">
        <div class="toast-body">
          Você precisa estar logado para acessar esta página.
        </div>
        <button type="button" class="btn btn-secondary ms-2" id="redirectToLogin">Ir para Login</button>
      </div>
    </div>
  `;
    document.body.appendChild(toastContainer);

    const toastElement = new bootstrap.Toast(toastContainer.querySelector('.toast'));
    toastElement.show();

    // Botão para redirecionar para o login
    document.getElementById('redirectToLogin').addEventListener('click', () => {
        window.location.href = 'login.html';
    });
}

// Função para verificar o login
function checkUserLoggedIn() {
  if (!isUserLoggedIn()) {
      document.getElementById('homeSection').style.display = 'none';
      showErrorToast();
  } else {
      const user = getUser();
      if (user) {
          console.log('user: ', user);
          console.log('user.dataCriacao: ', user.conta.usuario.nome);
          document.querySelector('#homeSection h2').innerText = `Bem-vindo(a), ${user.conta.usuario.nome}!`;
          document.getElementById('homeSection').style.display = 'block';
      } else {
          console.error('Erro ao carregar os dados do usuário.');
      }
  }
}

// Verifica o login ao carregar a página
if (document.querySelector('#homeSection')) {
  checkUserLoggedIn();
}
