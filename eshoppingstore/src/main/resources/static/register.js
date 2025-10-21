// Registration form handling
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const messageContainer = document.getElementById('messageContainer');
    const messageContent = document.getElementById('messageContent');

    // Handle form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            username: document.getElementById('username').value.trim(),
            email: document.getElementById('email').value.trim(),
            phoneNumber: document.getElementById('phoneNumber').value.trim(),
            password: document.getElementById('password').value,
            address: document.getElementById('address').value.trim()
        };

        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Validate form
        if (!validateForm(formData, confirmPassword, agreeTerms)) {
            return;
        }

        // Register user
        registerUser(formData);
    });

    // Form validation
    function validateForm(formData, confirmPassword, agreeTerms) {
        // Check required fields
        if (!formData.fullName) {
            showMessage('Please enter your full name', 'error');
            return false;
        }

        if (!formData.username) {
            showMessage('Please enter a username', 'error');
            return false;
        }

        if (formData.username.length < 3) {
            showMessage('Username must be at least 3 characters long', 'error');
            return false;
        }

        if (!formData.email) {
            showMessage('Please enter your email address', 'error');
            return false;
        }

        if (!isValidEmail(formData.email)) {
            showMessage('Please enter a valid email address', 'error');
            return false;
        }

        if (!formData.password) {
            showMessage('Please enter a password', 'error');
            return false;
        }

        if (formData.password.length < 6) {
            showMessage('Password must be at least 6 characters long', 'error');
            return false;
        }

        if (formData.password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return false;
        }

        if (!agreeTerms) {
            showMessage('Please agree to the Terms and Conditions', 'error');
            return false;
        }

        return true;
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Register user function
    async function registerUser(userData) {
        try {
            // Show loading state
            const registerBtn = document.querySelector('.register-btn');
            const originalText = registerBtn.textContent;
            registerBtn.textContent = 'Creating Account...';
            registerBtn.disabled = true;

            // Send registration request
            const response = await fetch('/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            // Reset button
            registerBtn.textContent = originalText;
            registerBtn.disabled = false;

            if (result.success) {
                showMessage(result.message, 'success');

                // Clear form
                document.getElementById('registerForm').reset();

                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            } else {
                showMessage(result.message, 'error');
            }

        } catch (error) {
            console.error('Registration error:', error);
            showMessage('Registration failed. Please try again.', 'error');

            // Reset button
            const registerBtn = document.querySelector('.register-btn');
            registerBtn.textContent = 'Create Account';
            registerBtn.disabled = false;
        }
    }

    // Show message function
    function showMessage(message, type) {
        messageContent.textContent = message;
        messageContent.className = `message-content ${type}`;
        messageContainer.style.display = 'block';

        // Hide message after 5 seconds
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    }

    // Real-time validation
    document.getElementById('username').addEventListener('input', function() {
        const username = this.value.trim();
        if (username.length > 0 && username.length < 3) {
            this.style.borderColor = '#F44336';
        } else {
            this.style.borderColor = '#e0e0e0';
        }
    });

    document.getElementById('email').addEventListener('input', function() {
        const email = this.value.trim();
        if (email.length > 0 && !isValidEmail(email)) {
            this.style.borderColor = '#F44336';
        } else {
            this.style.borderColor = '#e0e0e0';
        }
    });

    document.getElementById('password').addEventListener('input', function() {
        const password = this.value;
        if (password.length > 0 && password.length < 6) {
            this.style.borderColor = '#F44336';
        } else {
            this.style.borderColor = '#e0e0e0';
        }

        // Check confirm password match
        checkPasswordMatch();
    });

    document.getElementById('confirmPassword').addEventListener('input', checkPasswordMatch);

    function checkPasswordMatch() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmField = document.getElementById('confirmPassword');

        if (confirmPassword.length > 0) {
            if (password === confirmPassword) {
                confirmField.style.borderColor = '#4CAF50';
            } else {
                confirmField.style.borderColor = '#F44336';
            }
        } else {
            confirmField.style.borderColor = '#e0e0e0';
        }
    }
});