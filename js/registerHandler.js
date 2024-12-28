import userManager from './auth.js';

class RegisterHandler {
    constructor() {
        this.form = document.getElementById('registerForm');
        this.errorElement = document.getElementById('registerError');
        this.initialize();
    }

    initialize() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.errorElement.textContent = '';

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const email = document.getElementById('email').value;
        const fullName = document.getElementById('fullName').value;

        if (!this.validateForm(password, confirmPassword, email)) {
            return;
        }

        try {
            await userManager.register(username, password, email, fullName);
            await userManager.login(username, password);
            window.location.href = 'index.html';
        } catch (error) {
            this.errorElement.textContent = error.message;
        }
    }

    validateForm(password, confirmPassword, email) {
        if (password !== confirmPassword) {
            this.errorElement.textContent = 'Passwords do not match';
            return false;
        }

        if (!this.validateEmail(email)) {
            this.errorElement.textContent = 'Invalid email address';
            return false;
        }

        return true;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// Initialize the handler when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RegisterHandler();
});