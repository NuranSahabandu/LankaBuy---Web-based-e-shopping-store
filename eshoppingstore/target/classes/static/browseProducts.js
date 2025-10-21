const API_BASE_URL = 'http://localhost:8080';
let allProducts = [];
let currentProduct = null;

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
                        <p class="empty-text">Please check your connection and try again</p>
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
                        <p class="empty-text">Try adjusting your search or filters</p>
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
    card.onclick = () => viewProductDetails(product);

    // Image HTML
    let imageHTML;
    if (product.productImageUrl && product.productImageUrl.trim() !== '') {
        imageHTML = `
                    <img src="${product.productImageUrl}"
                         class="product-image"
                         alt="${product.productName}"
                         onerror="this.parentElement.innerHTML='<div class=\\'no-image\\'>📷</div><div class=\\'product-badge\\'>New</div>'">
                    <div class="product-badge">New</div>
                `;
    } else {
        imageHTML = `
                    <div class="no-image">📷</div>
                    <div class="product-badge">New</div>
                `;
    }

    card.innerHTML = `
                <div class="product-image-container">
                    ${imageHTML}
                </div>
                <div class="product-info">
                    <div class="product-category">${product.productCategory}</div>
                    <h3 class="product-name">${product.productName}</h3>
                    <p class="product-description">${product.productDescription}</p>
                    <div class="product-price">Rs. ${formatPrice(product.productPrice)}</div>
                    <div class="product-actions">
                        <button class="action-btn view-btn" onclick="event.stopPropagation(); viewProductDetails(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                            View Details
                        </button>
                        <button class="action-btn add-cart-btn" onclick="event.stopPropagation(); addToCartQuick('${product.productId}', '${product.productName.replace(/'/g, "\\'")}')">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;

    return card;
}

// ==================== VIEW PRODUCT DETAILS ====================

function viewProductDetails(product) {
    currentProduct = product;

    // Set modal content
    document.getElementById('modalCategory').textContent = product.productCategory;
    document.getElementById('modalTitle').textContent = product.productName;
    document.getElementById('modalPrice').textContent = `Rs. ${formatPrice(product.productPrice)}`;
    document.getElementById('modalDescription').textContent = product.productDescription;

    // Set image
    const modalImage = document.getElementById('modalImage');
    if (product.productImageUrl && product.productImageUrl.trim() !== '') {
        modalImage.src = product.productImageUrl;
        modalImage.style.display = 'block';
    } else {
        modalImage.style.display = 'none';
    }

    // Show modal
    document.getElementById('productModal').classList.add('show');
}

function closeModal() {
    document.getElementById('productModal').classList.remove('show');
}

// ==================== CART FUNCTIONS ====================

function addToCart() {
    if (currentProduct) {
        showAlert(`${currentProduct.productName} added to cart!`, 'success');
        closeModal();
    }
}

function addToCartQuick(productId, productName) {
    showAlert(`${productName} added to cart!`, 'success');
}

// ==================== SEARCH PRODUCTS ====================

function searchProducts() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    let filteredProducts = allProducts;

    // Filter by search term
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => {
            return product.productId.toLowerCase().includes(searchTerm) ||
                product.productName.toLowerCase().includes(searchTerm) ||
                product.productCategory.toLowerCase().includes(searchTerm) ||
                product.productDescription.toLowerCase().includes(searchTerm);
        });
    }

    // Filter by category
    if (category) {
        filteredProducts = filteredProducts.filter(product =>
            product.productCategory === category
        );
    }

    displayProducts(filteredProducts);
    updateProductCount(filteredProducts.length);
}

// ==================== FILTER BY CATEGORY ====================

function filterByCategory() {
    searchProducts();
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
        countDiv.style.display = 'block';
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
    }, 3000);
}

// Close modal when clicking outside
document.getElementById('productModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});