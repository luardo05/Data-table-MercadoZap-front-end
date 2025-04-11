document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/api';
    const productModal = document.getElementById('productModal');
    const productForm = document.getElementById('productForm');
    const addProductBtn = document.getElementById('addProductBtn');
    const modalTitle = document.getElementById('modalTitle');
    let editProductId = null;

    // Função para carregar produtos
    const loadProducts = async () => {
        const response = await fetch(`${apiUrl}/products`);
        const products = await response.json();
        const tableBody = document.querySelector('#productsTable tbody');
        tableBody.innerHTML = '';

        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.product_name}</td>
                <td>${product.market}</td>
                <td>${product.brand}</td>
                <td>${product.price}</td>
                <td>
                    <button class="editProductBtn" data-id="${product._id}">Editar</button>
                    <button class="deleteProductBtn" data-id="${product._id}">Deletar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Adicionar eventos de edição e deleção
        document.querySelectorAll('.editProductBtn').forEach(button => {
            button.addEventListener('click', (e) => openEditProductModal(e.target.dataset.id));
        });

        document.querySelectorAll('.deleteProductBtn').forEach(button => {
            button.addEventListener('click', (e) => deleteProduct(e.target.dataset.id));
        });
    };

    // Função para adicionar produto
    const addProduct = async (product) => {
        await fetch(`${apiUrl}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        loadProducts();
    };

    // Função para atualizar produto
    const updateProduct = async (id, product) => {
        await fetch(`${apiUrl}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        loadProducts();
    };

    // Função para deletar produto
    const deleteProduct = async (id) => {
        await fetch(`${apiUrl}/products/${id}`, {
            method: 'DELETE'
        });
        loadProducts();
    };

    // Abrir modal para editar produto
    const openEditProductModal = async (id) => {
        editProductId = id;
        modalTitle.innerText = 'Editar Produto';

        const response = await fetch(`${apiUrl}/products/${id}`);
        const product = await response.json();

        document.getElementById('product_name').value = product.product_name;
        document.getElementById('market').value = product.market;
        document.getElementById('brand').value = product.brand;
        document.getElementById('price').value = product.price;

        productModal.style.display = 'block';
    };

    // Abrir modal para adicionar novo produto
    const openAddProductModal = () => {
        editProductId = null;
        modalTitle.innerText = 'Adicionar Produto';
        productForm.reset();
        productModal.style.display = 'block';
    };

    // Fechar modal ao clicar no "x"
    document.querySelector('.close').addEventListener('click', () => {
        productModal.style.display = 'none';
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === productModal) {
            productModal.style.display = 'none';
        }
    });

    // Submissão do formulário de produto
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const productData = {
            product_name: document.getElementById('product_name').value,
            market: document.getElementById('market').value,
            brand: document.getElementById('brand').value,
            price: document.getElementById('price').value
        };

        if (editProductId) {
            await updateProduct(editProductId, productData);
        } else {
            await addProduct(productData);
        }

        productModal.style.display = 'none';
        loadProducts();
    });

    // Inicialização
    addProductBtn.addEventListener('click', openAddProductModal);
    loadProducts();
});
