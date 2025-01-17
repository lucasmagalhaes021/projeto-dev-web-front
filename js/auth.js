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

    const conta = rawUserData.conta?.[0];
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
                sobrenome: conta?.usuario?.sobrenome || '', // Novo campo
                senha: conta?.usuario?.senha || '',
                dataNascimento: conta?.usuario?.dataNascimento || null,
                endereco: {
                    rua: conta?.usuario?.idEndereco?.rua || '',
                    numero: conta?.usuario?.idEndereco?.numero || '',
                    complemento: conta?.usuario?.idEndereco?.complemento || '',
                    bairro: conta?.usuario?.idEndereco?.bairro || '',
                    cidade: conta?.usuario?.idEndereco?.cidade || '',
                    uf: conta?.usuario?.idEndereco?.uf || '',
                    cep: conta?.usuario?.idEndereco?.cep || '',
                },
                contato: {
                    ddd: conta?.usuario?.idContato?.ddd || '',
                    telefone: conta?.usuario?.idContato?.telefone || '',
                    email: conta?.usuario?.idContato?.email || '',
                },
                role: conta?.usuario?.role || 'USER',
            },
            chavePix: conta?.chavePix || null
        }
    };
}
