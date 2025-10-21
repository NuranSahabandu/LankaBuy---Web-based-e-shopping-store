const API_BASE_URL = 'http://localhost:8080';

// ==================== FORM SUBMISSION ====================

document.getElementById('productForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
        showAlert('Please fill in all required fields correctly', 'error');
        return;
    }

    // Get form data
    const productData = getProductData();

    // Show loading
    setButtonLoading(true);

    try {
        // Send to backend
        const response = await fetch(`${API_BASE_URL}/products/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            throw new Error('Failed to add product');
        }

        const result = await response.text();

        // Success
        showAlert('✅ Product added successfully!', 'success');

        // Reset form after 2 seconds
        setTimeout(() => {
            resetForm();
        }, 2000);

    } catch (error) {
        console.error('Error:', error);
        showAlert('❌ Failed to add product. Make sure your backend is running.', 'error');
    } finally {
        setButtonLoading(false);
    }
});

// ==================== GET FORM DATA ====================

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

// ==================== FORM VALIDATION ====================

function validateForm() {
    let isValid = true;

    // Product ID
    const productId = document.getElementById('productId').value.trim();
    if (!productId) {
        showFieldError('productIdError', 'Product ID is required');
        isValid = false;
    } else {
        clearFieldError('productIdError');
    }

    // Product Name
    const productName = document.getElementById('productName').value.trim();
    if (!productName) {
        showFieldError('productNameError', 'Product name is required');
        isValid = false;
    } else {
        clearFieldError('productNameError');
    }

    // Category
    const category = document.getElementById('productCategory').value;
    if (!category) {
        showFieldError('categoryError', 'Please select a category');
        isValid = false;
    } else {
        clearFieldError('categoryError');
    }

    // Price
    const price = document.getElementById('productPrice').value;
    if (!price || parseFloat(price) <= 0) {
        showFieldError('priceError', 'Please enter a valid price');
        isValid = false;
    } else {
        clearFieldError('priceError');
    }

    // Description
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

// ==================== IMAGE HANDLING ====================

// Click to upload
document.getElementById('imageUploadArea').addEventListener('click', function() {
    document.getElementById('productImageFile').click();
});

// File input change
document.getElementById('productImageFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        handleImageFile(file);
    }
});

// Drag and drop
const uploadArea = document.getElementById('imageUploadArea');

uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', function() {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageFile(file);
    } else {
        showAlert('Please upload an image file', 'error');
    }
});

function handleImageFile(file) {
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showAlert('Image size must be less than 5MB', 'error');
        return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('imagePreview').src = e.target.result;
        document.getElementById('imagePreviewContainer').style.display = 'block';
        document.getElementById('imageUploadArea').style.display = 'none';

        showAlert('Image preview loaded! Use Image URL field to save image.', 'info');
    };
    reader.readAsDataURL(file);
}

// Remove image preview
function removeImage() {
    document.getElementById('imagePreview').src = '';
    document.getElementById('imagePreviewContainer').style.display = 'none';
    document.getElementById('imageUploadArea').style.display = 'block';
    document.getElementById('productImageFile').value = '';
}

// ==================== CHARACTER COUNTER ====================

document.getElementById('productDescription').addEventListener('input', function() {
    const length = this.value.length;
    document.getElementById('charCount').textContent = length;
});

// ==================== UTILITY FUNCTIONS ====================

// Show alert message
function showAlert(message, type) {
    // Remove existing alert
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;

    document.body.appendChild(alert);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Set button loading state
function setButtonLoading(isLoading) {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loading = submitBtn.querySelector('.loading');

    if (isLoading) {
        btnText.style.display = 'none';
        loading.style.display = 'inline-block';
        submitBtn.disabled = true;
    } else {
        btnText.style.display = 'inline';
        loading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Reset form
function resetForm() {
    document.getElementById('productForm').reset();
    removeImage();
    document.getElementById('charCount').textContent = '0';

    // Clear all error messages
    clearFieldError('productIdError');
    clearFieldError('productNameError');
    clearFieldError('categoryError');
    clearFieldError('priceError');
    clearFieldError('descriptionError');
}

// Cancel form
function cancelForm() {
    if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
        resetForm();
    }
}