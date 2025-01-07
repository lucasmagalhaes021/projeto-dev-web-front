// Função para salvar os dados do usuário no localStorage
export function saveUser(userData) {
    localStorage.setItem('userLoggedIn', JSON.stringify(userData));
}

// Função para obter os dados do usuário do localStorage
export function getUser() {
    return JSON.parse(localStorage.getItem('userLoggedIn'));
}

// Função para limpar os dados do usuário
export function clearUser() {
    localStorage.removeItem('userLoggedIn');
}

// Função para verificar se o usuário está logado
export function isUserLoggedIn() {
    const user = getUser();
    return user && user.sucess;
}
