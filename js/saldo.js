export async function fetchSaldo(id_conta) {
    try {
        const response = await fetch(`http://localhost:8080/conta/${id_conta}/saldo`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar saldo: ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Supondo que o saldo vem na propriedade "saldo"
    } catch (error) {
        console.error('Erro ao buscar saldo:', error);
        return null;
    }
}

export function updateSaldoHTML(saldo) {
    if (saldo !== null) {
        const saldoElement = document.querySelector('#homeSection .text-success');
        saldoElement.innerText = `R$ ${saldo.toFixed(2).replace('.', ',')}`;
    }
}
