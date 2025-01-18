// common.js
function logout() {
    localStorage.removeItem('userLoggedIn');
    console.log('Usuário desconectado com sucesso.');
    window.location.href = '../login.html'; // Redireciona para a página inicial ou de login
  }
  