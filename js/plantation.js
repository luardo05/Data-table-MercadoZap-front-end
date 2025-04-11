document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/api'; // Atualize para o URL correto da sua API
    const plantationModal = document.getElementById('plantationModal');
    const plantationForm = document.getElementById('plantationForm');
    const addPlantationBtn = document.getElementById('addPlantationBtn');
    const modalTitlePlantation = document.getElementById('modalTitlePlantation');
    let editPlantationId = null;

    // Função para carregar plantações
    const loadPlantations = async () => {
        const response = await fetch(`${apiUrl}/plantations`);
        const plantations = await response.json();
        const tableBody = document.querySelector('#plantationsTable tbody');
        tableBody.innerHTML = '';

        plantations.forEach(plantation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${plantation.name}</td>
                <td>${plantation.description}</td>
                <td>${plantation.responsible ? plantation.responsible.name : 'N/A'}</td>
                <td>
                    <button class="editPlantationBtn" data-id="${plantation._id}">Editar</button>
                    <button class="deletePlantationBtn" data-id="${plantation._id}">Deletar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Adicionar eventos de edição e deleção
        document.querySelectorAll('.editPlantationBtn').forEach(button => {
            button.addEventListener('click', (e) => openEditPlantationModal(e.target.dataset.id));
        });

        document.querySelectorAll('.deletePlantationBtn').forEach(button => {
            button.addEventListener('click', (e) => deletePlantation(e.target.dataset.id));
        });
    };

    // Função para adicionar plantação
    const addPlantation = async (plantation) => {
        await fetch(`${apiUrl}/plantations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(plantation)
        });
        loadPlantations();
    };

    // Função para atualizar plantação
    const updatePlantation = async (id, plantation) => {
        await fetch(`${apiUrl}/plantations/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(plantation)
        });
        loadPlantations();
    };

    // Função para deletar plantação
    const deletePlantation = async (id) => {
        await fetch(`${apiUrl}/plantations/${id}`, {
            method: 'DELETE'
        });
        loadPlantations();
    };

    // Abrir modal para editar plantação
    const openEditPlantationModal = async (id) => {
        editPlantationId = id;
        modalTitlePlantation.innerText = 'Editar Plantação';

        // Buscar os dados da plantação para preencher o modal
        const response = await fetch(`${apiUrl}/plantations/${id}`);
        if (response.status === 404) {
            console.error('Plantação não encontrada');
            return;
        }
        const plantation = await response.json();

        document.getElementById('namePlantation').value = plantation.name;
        document.getElementById('description').value = plantation.description;
        await loadUsers(plantation.responsible ? plantation.responsible._id : null);

        plantationModal.style.display = 'block';
    };

    // Abrir modal para adicionar nova plantação
    const openAddPlantationModal = async () => {
        editPlantationId = null;
        modalTitlePlantation.innerText = 'Adicionar Plantação';
        plantationForm.reset();
        await loadUsers(); // Carrega os usuários sem pré-selecionar nenhum
        plantationModal.style.display = 'block';
    };

    // Carregar usuários para o select de responsável
    const loadUsers = async (selectedUserId = null) => {
        const response = await fetch(`${apiUrl}/users`);
        const users = await response.json();
        const select = document.getElementById('responsible');
        select.innerHTML = ''; // Limpa o select

        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user._id;
            option.text = user.name;
            if (user._id === selectedUserId) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    };

    // Fechar modal ao clicar no "x"
    document.querySelector('.close').addEventListener('click', () => {
        plantationModal.style.display = 'none';
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === plantationModal) {
            plantationModal.style.display = 'none';
        }
    });

    // Submissão do formulário
    plantationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const plantationData = {
            name: document.getElementById('namePlantation').value,
            description: document.getElementById('description').value,
            responsible: document.getElementById('responsible').value
        };

        if (editPlantationId) {
            await updatePlantation(editPlantationId, plantationData);
        } else {
            await addPlantation(plantationData);
        }

        plantationModal.style.display = 'none';
        loadPlantations();
    });

    // Inicializando o carregamento de plantações e eventos
    addPlantationBtn.addEventListener('click', openAddPlantationModal);
    loadPlantations();
});
