import userManager from './auth.js';

class RegisterHandler {
    constructor() {
        this.form = document.getElementById('registerForm');
        this.errorElement = document.getElementById('registerError');
        this.submitButton = document.getElementById('submitButton');
        this.initialize();
    }

    initialize() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value.trim();
        const fullName = document.getElementById('fullName').value.trim();

        console.log("Form data:", { username, password, email, fullName });

        try {
            await userManager.register(username, password, email, fullName);
            console.log("Registration successful");

            await userManager.login(username, password);
            window.location.href = '../index.html';
        } catch (error) {
            this.errorElement.textContent = error.message;
            console.error("Registration error:", error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RegisterHandler();
});