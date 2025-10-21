const API_BASE_URL = 'http://localhost:8080';
let allProducts = [];

// ==================== LOAD PRODUCTS ON PAGE LOAD ====================

window.addEventListener('load', function() {
    loadAllProducts();
});

// ==================== LOAD ALL PRODUCTS ====================

async function loadAllProducts() {
    const container = document.getElementById('productsContainer');

    // Show loading
    container.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    Loading products...
                </div>
            `;

    try {
        const response = await fetch(`${API_BASE_URL}/products`);

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const products = await response.json();
        allProducts = products;

        displayProducts(products);
        updateProductCount(products.length);

    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">❌</div>
                        <h2 class="empty-title">Failed to Load Products</h2>
                        <p class="empty-text">Make sure your Spring Boot server is running on port 8080</p>
                        <button class="refresh-btn" onclick="loadAllProducts()">Try Again</button>
                    </div>
                `;
    }
}

// ==================== DISPLAY PRODUCTS ====================

function displayProducts(products) {
    const container = document.getElementById('productsContainer');

    if (!products || products.length === 0) {
        container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📦</div>
                        <h2 class="empty-title">No Products Found</h2>
                        <p class="empty-text">Start by adding your first product to LankaBuy</p>
                        <button class="nav-btn add-btn" onclick="goToAddProduct()">
                            ➕ Add New Product
                        </button>
                    </div>
                `;
        return;
    }

    const productsGrid = document.createElement('div');
    productsGrid.className = 'products-grid';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });

    container.innerHTML = '';
    container.appendChild(productsGrid);
}

// ==================== CREATE PRODUCT CARD ====================

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.productId);
    card.setAttribute('data-product-name', product.productName.toLowerCase());
    card.setAttribute('data-product-category', product.productCategory.toLowerCase());

    // Image HTML
    let imageHTML;
    if (product.productImageUrl && product.productImageUrl.trim() !== '') {
        imageHTML = `
                    <img src="${product.productImageUrl}"
                         class="product-image"
                         alt="${product.productName}"
                         onerror="this.parentElement.innerHTML='<div class=\\'no-image\\'>📷</div>'">
                `;
    } else {
        imageHTML = `<div class="no-image">📷</div>`;
    }

    card.innerHTML = `
                <div class="product-image-container">
                    ${imageHTML}
                </div>
                <div class="product-info">
                    <div class="product-id">ID: ${product.productId}</div>
                    <div class="product-category">${product.productCategory}</div>
                    <h3 class="product-name">${product.productName}</h3>
                    <p class="product-description">${product.productDescription}</p>
                    <div class="product-price">Rs. ${formatPrice(product.productPrice)}</div>
                    <div class="product-actions">
                        <button class="action-btn view-btn" onclick="viewProductDetails('${product.productId}')">
                            👁️ View
                        </button>                
                        <button class="action-btn delete-btn" onclick="confirmDeleteProduct('${product.productId}', '${product.productName.replace(/'/g, "\\'")}')">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            `;

    return card;
}

// ==================== DELETE PRODUCT ====================

function confirmDeleteProduct(productId, productName) {
    const confirmed = confirm(`Are you sure you want to delete:\n\nProduct: ${productName}\nID: ${productId}\n\nThis action cannot be undone.`);

    if (confirmed) {
        deleteProduct(productId);
    }
}

function goToUpdateProduct() {
    window.location.href = 'lankabuy_update_product.html';
}



async function deleteProduct(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/delete/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete product');
        }

        const result = await response.text();

        showAlert(`Product ${productId} deleted successfully!`, 'success');

        // Remove product card with animation
        const card = document.querySelector(`[data-product-id="${productId}"]`);
        if (card) {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.remove();
                // Update count
                allProducts = allProducts.filter(p => p.productId !== productId);
                updateProductCount(allProducts.length);

                // If no products left, show empty state
                if (allProducts.length === 0) {
                    displayProducts([]);
                }
            }, 300);
        }

    } catch (error) {
        console.error('Error:', error);
        showAlert('Failed to delete product. Please try again.', 'error');
    }
}

// ==================== DELETE BY ID ====================

async function deleteProductById() {
    const productId = document.getElementById('deleteProductIdInput').value.trim();

    if (!productId) {
        showAlert('Please enter a Product ID', 'error');
        return;
    }

    const confirmed = confirm(`Are you sure you want to delete product with ID: ${productId}?\n\nThis action cannot be undone.`);

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products/delete/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Product not found or failed to delete');
        }

        const result = await response.text();

        showAlert(result, 'success');

        // Clear input
        document.getElementById('deleteProductIdInput').value = '';

        // Reload products
        setTimeout(() => {
            loadAllProducts();
        }, 1000);

    } catch (error) {
        console.error('Error:', error);
        showAlert(`Failed to delete product ${productId}. Product may not exist.`, 'error');
    }
}

// ==================== VIEW PRODUCT DETAILS ====================

async function viewProductDetails(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }

        const product = await response.json();

        // Display product details in alert
        alert(`Product Details:\n\n` +
            `ID: ${product.productId}\n` +
            `Name: ${product.productName}\n` +
            `Category: ${product.productCategory}\n` +
            `Price: Rs. ${formatPrice(product.productPrice)}\n` +
            `Description: ${product.productDescription}\n` +
            `Image URL: ${product.productImageUrl || 'No image'}`);

    } catch (error) {
        console.error('Error:', error);
        showAlert('Failed to load product details', 'error');
    }
}

// ==================== SEARCH PRODUCTS ====================

function searchProducts() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();

    if (!searchTerm) {
        displayProducts(allProducts);
        return;
    }

    const filteredProducts = allProducts.filter(product => {
        return product.productId.toLowerCase().includes(searchTerm) ||
            product.productName.toLowerCase().includes(searchTerm) ||
            product.productCategory.toLowerCase().includes(searchTerm) ||
            product.productDescription.toLowerCase().includes(searchTerm);
    });

    displayProducts(filteredProducts);
    updateProductCount(filteredProducts.length);
}

// ==================== UTILITY FUNCTIONS ====================

function formatPrice(price) {
    return parseFloat(price).toLocaleString('en-LK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function updateProductCount(count) {
    const countDiv = document.getElementById('productsCount');
    const countNumber = document.getElementById('productCountNumber');

    if (count > 0) {
        countDiv.style.display = 'flex';
        countNumber.textContent = count;
    } else {
        countDiv.style.display = 'none';
    }
}

function showAlert(message, type) {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;

    document.body.appendChild(alert);

    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

function goToAddProduct() {
    // Redirect to add product page
    window.location.href = 'lankabuy_add_product_form.html';
}

