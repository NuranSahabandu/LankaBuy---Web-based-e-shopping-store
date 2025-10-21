const API_BASE_URL = 'http://localhost:8080';
let originalProductId = null;

async function searchProduct() {
    const productId = document.getElementById('searchProductId').value.trim();

    if (!productId) {
        showAlert('Please enter a Product ID', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);

        if (!response.ok) {
            throw new Error('Product not found');
        }

        const product = await response.json();

        originalProductId = product.productId;
        populateForm(product);
        document.getElementById('updateForm').classList.add('show');
        showAlert('Product found! You can now update the information.', 'success');

    } catch (error) {
        console.error('Error:', error);
        showAlert(`Product with ID "${productId}" not found`, 'error');
        document.getElementById('updateForm').classList.remove('show');
    }
}

function populateForm(product) {
    document.getElementById('productId').value = product.productId;
    document.getElementById('productName').value = product.productName;
    document.getElementById('productPrice').value = product.productPrice;
    document.getElementById('productCategory').value = product.productCategory;
    document.getElementById('productDescription').value = product.productDescription;
    document.getElementById('productImageUrl').value = product.productImageUrl || '';

    const charCount = product.productDescription.length;
    document.getElementById('charCount').textContent = charCount;
}

document.getElementById('updateForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!validateForm()) {
        showAlert('Please fill in all required fields correctly', 'error');
        return;
    }

    const productData = getProductData();
    setButtonLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/products/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            throw new Error('Failed to update product');
        }

        const result = await response.text();
        showAlert('Product updated successfully!', 'success');

        setTimeout(() => {
            goToViewProducts();
        }, 2000);

    } catch (error) {
        console.error('Error:', error);
        showAlert('Failed to update product. Please try again.', 'error');
    } finally {
        setButtonLoading(false);
    }
});

function getProductData() {
    return {
        productId: document.getElementById('productId').value.trim(),
        productName: document.getElementById('productName').value.trim(),
        productPrice: document.getElementById('productPrice').value,
        productDescription: document.getElementById('productDescription').value.trim(),
        productCategory: document.getElementById('productCategory').value,
        productImageUrl: document.getElementById('productImageUrl').value.trim() || null
    };
}

function validateForm() {
    let isValid = true;

    const productName = document.getElementById('productName').value.trim();
    if (!productName) {
        showFieldError('productNameError', 'Product name is required');
        isValid = false;
    } else {
        clearFieldError('productNameError');
    }

    const category = document.getElementById('productCategory').value;
    if (!category) {
        showFieldError('categoryError', 'Please select a category');
        isValid = false;
    } else {
        clearFieldError('categoryError');
    }

    const price = document.getElementById('productPrice').value;
    if (!price || parseFloat(price) <= 0) {
        showFieldError('priceError', 'Please enter a valid price');
        isValid = false;
    } else {
        clearFieldError('priceError');
    }

    const description = document.getElementById('productDescription').value.trim();
    if (!description) {
        showFieldError('descriptionError', 'Product description is required');
        isValid = false;
    } else {
        clearFieldError('descriptionError');
    }

    return isValid;
}

function showFieldError(fieldId, message) {
    const errorDiv = document.getElementById(fieldId);
    errorDiv.textContent = message;
    errorDiv.className = 'validation-message error';
}

function clearFieldError(fieldId) {
    const errorDiv = document.getElementById(fieldId);
    errorDiv.textContent = '';
    errorDiv.className = 'validation-message';
}

document.getElementById('productDescription').addEventListener('input', function() {
    const length = this.value.length;
    document.getElementById('charCount').textContent = length;
});

function setButtonLoading(isLoading) {
    const submitBtn = document.getElementById('submitBtn');
    if (isLoading) {
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
    }
}

function cancelUpdate() {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
        goToViewProducts();
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

function goToViewProducts() {
    window.location.href = 'lankabuy_view_products.html';
}

document.getElementById('searchProductId').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchProduct();
    }
});