// Authentication utility functions
class Auth {

    // Check if user is logged in
    static async isLoggedIn() {
        try {
            const response = await fetch('/users/check-login');
            const result = await response.json();
            return result.loggedIn;
        } catch (error) {
            console.error('Error checking login status:', error);
            return false;
        }
    }

    // Get current user info
    static async getCurrentUser() {
        try {
            const response = await fetch('/users/current');
            const result = await response.json();

            if (result.success) {
                return result.user;
            }
            return null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    // Logout user
    static async logout() {
        try {
            const response = await fetch('/users/logout', {
                method: 'POST'
            });
            const result = await response.json();

            if (result.success) {
                // Clear local storage
                localStorage.removeItem('currentUser');

                // Redirect to login page
                window.location.href = 'login.html';
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error logging out:', error);
            return false;
        }
    }

    // Redirect to login if not authenticated
    static async requireLogin() {
        const loggedIn = await this.isLoggedIn();
        if (!loggedIn) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Require admin role
    static async requireAdmin() {
        const user = await this.getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            alert('Access denied. Admin privileges required.');
            window.location.href = 'browseProducts.html';
            return false;
        }
        return true;
    }

    // Update navigation based on login status
    static async updateNavigation() {
        const user = await this.getCurrentUser();

        // Find navigation elements
        const navButtons = document.querySelector('.nav-buttons');
        if (!navButtons) return;

        if (user) {
            // User is logged in
            navButtons.innerHTML = `
            <span class="user-welcome">Welcome, ${user.fullName || user.username}!</span>

            <!-- ✅ Always show Promotions -->
            <button onclick="window.location.href='/Promotions'" class="nav-btn promo-btn">🎉 Promotions</button>

            ${user.role === 'ADMIN'
                ? `
                   <button onclick="window.location.href='lankabuy_view_products.html'" class="nav-btn">Admin Panel</button>
                   <button class="nav-btn add-btn" onclick="goToAddProduct()">➕ Add New Product</button>
                   <button class="nav-btn update-btn" onclick="goToUpdateProduct()">✏️ Update Product</button>
                  `
                : ''
            }

            <button onclick="Auth.logout()" class="nav-btn logout-btn">Logout</button>
        `;
        } else {
            // User is not logged in
            navButtons.innerHTML = `
            <!-- ✅ Always show Promotions -->
            <button onclick="window.location.href='/Promotions'" class="nav-btn promo-btn">🎉 Promotions</button>
            <button onclick="window.location.href='login.html'" class="nav-btn">Login</button>
            <button onclick="window.location.href='register.html'" class="nav-btn">Sign Up</button>
            <button onclick="window.location.href='browseProducts.html'" class="nav-btn">Browse</button>
        `;
        }
    }


    // Show login status message
    static showAuthMessage(message, type = 'info') {
        // Create message element if it doesn't exist
        let messageContainer = document.getElementById('authMessageContainer');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'authMessageContainer';
            messageContainer.className = 'auth-message-container';
            messageContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                display: none;
            `;
            document.body.appendChild(messageContainer);
        }

        messageContainer.innerHTML = `<div class="auth-message-content auth-${type}">${message}</div>`;
        messageContainer.style.display = 'block';

        // Hide after 4 seconds
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 4000);
    }
}

// Initialize authentication when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update navigation for all pages
    Auth.updateNavigation();

    // Add CSS for auth messages
    const authStyles = document.createElement('style');
    authStyles.textContent = `
        .auth-message-container {
            max-width: 300px;
        }
        
        .auth-message-content {
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease;
        }
        
        .auth-info {
            background: linear-gradient(45deg, #2196F3, #42A5F5);
            color: white;
        }
        
        .auth-success {
            background: linear-gradient(45deg, #4CAF50, #66BB6A);
            color: white;
        }
        
        .auth-error {
            background: linear-gradient(45deg, #F44336, #EF5350);
            color: white;
        }
        
        .user-welcome {
            color: #1B365D;
            font-weight: bold;
            margin-right: 15px;
        }
        
        .logout-btn {
            background: linear-gradient(45deg, #F44336, #EF5350) !important;
        }
        
        .logout-btn:hover {
            background: linear-gradient(45deg, #D32F2F, #F44336) !important;
        }
    `;
    document.head.appendChild(authStyles);
});

// Make Auth class globally available
window.Auth = Auth;
