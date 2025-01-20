// common.js
function logout() {
  localStorage.removeItem("userLoggedIn");
  console.log("Usuário desconectado com sucesso.");
  window.location.href = "../login.html"; // Redireciona para a página inicial ou de login
}

function checkAdmin() {
  const rawUserData = JSON.parse(localStorage.getItem('userLoggedIn'));
  console.log("rawUserData: >>> " + rawUserData.conta?.[0].usuario.role);
  if (rawUserData.conta?.[0].usuario.role ==="ADMIN") {
    window.location.href = "../usuario/admin.html";
  }else {
    alert("🚫 Acesso Restrito! Esta seção está disponível apenas para administradores. Caso precise de acesso, entre em contato com o suporte.")
  }
  //window.location.href = "../login.html"; // Redireciona para a página inicial ou de login
}