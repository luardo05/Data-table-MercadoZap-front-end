document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/api';
    const marketModal = document.getElementById('marketModal');
    const marketForm = document.getElementById('marketForm');
    const addMarketBtn = document.getElementById('addMarketBtn');
    const modalTitle = document.getElementById('modalTitle');
    let editMarketId = null;

    // Função para carregar produtos
    const loadMarkets = async () => {
        const response = await fetch(`${apiUrl}/markets`);
        const markets = await response.json();
        const tableBody = document.querySelector('#marketsTable tbody');
        tableBody.innerHTML = '';

        markets.forEach(market => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${market.name}</td>
                <td>${market.address}</td>
                <td>
                    <button class="editMarketBtn" data-id="${market._id}">Editar</button>
                    <button class="deleteMarketBtn" data-id="${market._id}">Deletar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Adicionar eventos de edição e deleção
        document.querySelectorAll('.editMarketBtn').forEach(button => {
            button.addEventListener('click', (e) => openEditMarketModal(e.target.dataset.id));
        });

        document.querySelectorAll('.deleteMarketBtn').forEach(button => {
            button.addEventListener('click', (e) => deleteMarket(e.target.dataset.id));
        });
    };

    // Função para adicionar produto
    const addMarket = async (market) => {
        await fetch(`${apiUrl}/markets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(market)
        });
        loadMarkets();
    };

    // Função para atualizar produto
    const updateMarket = async (id, market) => {
        await fetch(`${apiUrl}/markets/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(market)
        });
        loadMarkets();
    };

    // Função para deletar produto
    const deleteMarket = async (id) => {
        await fetch(`${apiUrl}/markets/${id}`, {
            method: 'DELETE'
        });
        loadMarkets();
    };

    // Abrir modal para editar produto
    const openEditMarketModal = async (id) => {
        editMarketId = id;
        modalTitle.innerText = 'Editar Mercado';

        const response = await fetch(`${apiUrl}/markets/${id}`);
        const market = await response.json();

        document.getElementById('name').value = market.name;
        document.getElementById('address').value = market.address;

        marketModal.style.display = 'block';
    };

    // Abrir modal para adicionar novo produto
    const openAddMarketModal = () => {
        editMarketId = null;
        modalTitle.innerText = 'Adicionar Mercado';
        marketForm.reset();
        marketModal.style.display = 'block';
    };

    // Fechar modal ao clicar no "x"
    document.querySelector('.close').addEventListener('click', () => {
        marketModal.style.display = 'none';
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === marketModal) {
            marketModal.style.display = 'none';
        }
    });

    // Submissão do formulário de produto
    marketForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const marketData = {
            name: document.getElementById('name').value,
            address: document.getElementById('address').value,
        };

        if (editMarketId) {
            await updateMarket(editMarketId, marketData);
        } else {
            await addMarket(marketData);
        }

        marketModal.style.display = 'none';
        loadMarkets();
    });

    // Inicialização
    addMarketBtn.addEventListener('click', openAddMarketModal);
    loadMarkets();
});
