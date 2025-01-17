export async function fetchExtrato(id_conta) {
    try {
        const response = await fetch(`http://localhost:8080/transacao/extrato/${id_conta}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar extrato: ${response.statusText}`);
        }

        let data = await response.json();

        // Adicionando lógica para alteração dos nodes
        data = data.map(transacao => {
            if (
                transacao.tipoTransacao === 'DEPOSITO' && 
                transacao.idContaOrigem === id_conta && 
                transacao.idContaDestino !== id_conta &&
                transacao.idContaDestino !== null
            ) {
                transacao.tipoTransacao = 'TRANSFERENCIA';
                transacao.valor = -Math.abs(transacao.valor); // Garante que o valor seja negativo
            }

            if (transacao.tipoTransacao === 'SAQUE'){
                transacao.valor = -Math.abs(transacao.valor);
            }
            return transacao;
        });

        console.log('fetchextrato: data >>', data);
        return data;
    } catch (error) {
        console.error('Erro ao buscar extrato:', error);
        return null;
    }
}

export function updateExtratoHTML(extrato) {
    const tableBody = document.querySelector('#homeSection tbody'); // Seleciona o corpo da tabela
    tableBody.innerHTML = ''; // Limpa as linhas existentes

    if (extrato && extrato.length > 0) {
        extrato.forEach(transacao => {
            const dataTransacao = new Date(transacao.dataTransacao);
            const dataFormatada = `${dataTransacao.toLocaleDateString('pt-BR')} ${dataTransacao.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dataFormatada}</td>
                <td>${transacao.tipoTransacao}</td>
                <td class="${transacao.valor < 0 ? 'text-danger' : 'text-success'}">
                    ${transacao.valor < 0 ? '- ' : ''}R$ ${Math.abs(transacao.valor).toFixed(2)}
                </td>
                <td>${transacao.idContaOrigem || '-'}</td>
                <td>${transacao.idContaDestino || '-'}</td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5" class="text-center">Nenhuma transação encontrada.</td>
        `;
        tableBody.appendChild(row);
    }
}


