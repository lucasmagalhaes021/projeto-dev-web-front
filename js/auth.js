// Função para salvar os dados do usuário no localStorage
export function saveUser(userData) {
    localStorage.setItem('userLoggedIn', JSON.stringify(userData));
}

// Função para obter os dados do usuário do localStorage
export function getUser() {
    const rawUserData = JSON.parse(localStorage.getItem('userLoggedIn'));
    return sanitizeUserData(rawUserData);
}

// Função para limpar os dados do usuário
export function clearUser() {
    localStorage.removeItem('userLoggedIn');
}

// Função para verificar se o usuário está logado
export function isUserLoggedIn() {
    const user = getUser();
    return user && user.token;
}

function sanitizeUserData(rawUserData) {
    if (!rawUserData) return null;

    const conta = rawUserData.conta?.[0]; // Pega a primeira conta do array
    return {
        token: rawUserData.token || '',
        conta: {
            id: conta?.id || null,
            numeroConta: conta?.numeroConta || null,
            saldo: conta?.saldo || null,
            dataCriacao: conta?.dataCriacao || null,
            usuario: {
                id: conta?.usuario?.id || null,
                cpf: conta?.usuario?.cpf || '',
                nome: conta?.usuario?.nome || '',
                senha: conta?.usuario?.senha || '',
                dataNascimento: conta?.usuario?.dataNascimento || null,
                endereco: conta?.usuario?.idEndereco || null,
                contato: conta?.usuario?.idContato || null,
                role: conta?.usuario?.role || ''
            },
            chavePix: conta?.chavePix || null
        }
    };
}
