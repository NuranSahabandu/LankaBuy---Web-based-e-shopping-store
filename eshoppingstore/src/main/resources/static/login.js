// Login form handling
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const messageContainer = document.getElementById('messageContainer');
    const messageContent = document.getElementById('messageContent');

    // Check if user is already logged in
    checkLoginStatus();

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const usernameOrEmail = document.getElementById('usernameOrEmail').value.trim();
        const password = document.getElementById('password').value;

        // Validate form
        if (!validateForm(usernameOrEmail, password)) {
            return;
        }

        // Login user
        loginUser(usernameOrEmail, password);
    });

    // Form validation
    function validateForm(usernameOrEmail, password) {
        if (!usernameOrEmail) {
            showMessage('Please enter your username or email', 'error');
            return false;
        }

        if (!password) {
            showMessage('Please enter your password', 'error');
            return false;
        }

        return true;
    }

    // Login user function
    async function loginUser(usernameOrEmail, password) {
        try {
            // Show loading state
            const loginBtn = document.querySelector('.login-btn');
            const originalText = loginBtn.textContent;
            loginBtn.textContent = 'Logging in...';
            loginBtn.disabled = true;

            // Send login request
            const response = await fetch('/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usernameOrEmail: usernameOrEmail,
                    password: password
                })
            });

            const result = await response.json();

            // Reset button
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;

            if (result.success) {
                showMessage('Login successful! Redirecting...', 'success');

                // Store user info in localStorage for easy access
                localStorage.setItem('currentUser', JSON.stringify(result.user));

                // Redirect based on user role
                setTimeout(() => {
                    if (result.user.role === 'ADMIN') {
                        window.location.href = 'lankabuy_view_products.html'; // Admin dashboard
                    } else {
                        window.location.href = 'lankabuy_browse_products.html'; // Customer browsing
                    }
                }, 1500);

            } else {
                showMessage(result.message, 'error');
            }

        } catch (error) {
            console.error('Login error:', error);
            showMessage('Login failed. Please try again.', 'error');

            // Reset button
            const loginBtn = document.querySelector('.login-btn');
            loginBtn.textContent = 'Login';
            loginBtn.disabled = false;
        }
    }

    // Check if user is already logged in
    async function checkLoginStatus() {
        try {
            const response = await fetch('/users/check-login');
            const result = await response.json();

            if (result.loggedIn) {
                // User is already logged in, redirect them
                if (result.role === 'ADMIN') {
                    window.location.href = 'lankabuy_view_products.html';
                } else {
                    window.location.href = 'lankabuy_browse_products.html';
                }
            }
        } catch (error) {
            console.log('Could not check login status:', error);
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
});

// Demo account functions
function fillDemoAdmin() {
    document.getElementById('usernameOrEmail').value = 'admin';
    document.getElementById('password').value = 'admin123';
    showMessage('Demo admin credentials filled. Note: You need to register this account first!', 'success');
}

function fillDemoCustomer() {
    document.getElementById('usernameOrEmail').value = 'customer';
    document.getElementById('password').value = 'customer123';
    showMessage('Demo customer credentials filled. Note: You need to register this account first!', 'success');
}

// Utility function to show messages (for demo buttons)
function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    const messageContent = document.getElementById('messageContent');

    messageContent.textContent = message;
    messageContent.className = `message-content ${type}`;
    messageContainer.style.display = 'block';

    // Hide message after 5 seconds
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
}