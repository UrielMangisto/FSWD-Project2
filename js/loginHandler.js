import userManager from './auth.js';

class LoginHandler {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.errorElement = document.getElementById('loginError');
        this.submitButton = document.getElementById('submitButton');
        this.passwordInput = document.getElementById('password');
        this.togglePasswordButton = document.querySelector('.toggle-password');
        this.initialize();
    }

    initialize() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.togglePasswordButton.addEventListener('click', this.togglePasswordVisibility.bind(this));
    }

    togglePasswordVisibility() {
        const isPassword = this.passwordInput.type === 'password';
        this.passwordInput.type = isPassword ? 'text' : 'password';
        this.togglePasswordButton.textContent = isPassword ? '🔒' : '👁️';
    }

    async handleSubmit(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        try {
            await userManager.login(username, password);
            window.location.href = '../index.html';
        } catch (error) {
            this.errorElement.textContent = error.message;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LoginHandler();
});