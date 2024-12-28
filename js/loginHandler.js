import userManager from './auth.js';

class LoginHandler {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.errorElement = document.getElementById('loginError');
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

        try {
            await userManager.login(username, password);
            window.location.href = 'index.html';
        } catch (error) {
            this.errorElement.textContent = error.message;
        }
    }
}

// Initialize the handler when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginHandler();
});