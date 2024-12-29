// loginHandler.js
import userManager from '../js/auth.js';
import { showNotification, setupPasswordToggles } from './utils.js';

class LoginHandler {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.errorElement = document.getElementById('loginError');
        this.submitButton = document.getElementById('submitButton');
        this.initialize();
        setupPasswordToggles();
    }

    initialize() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.setupRememberMe();
    }

    setupRememberMe() {
        const rememberMe = document.getElementById('rememberMe');
        if (rememberMe) {
            const remembered = localStorage.getItem('rememberedUser');
            if (remembered) {
                const { username } = JSON.parse(remembered);
                document.getElementById('username').value = username;
                rememberMe.checked = true;
            }
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.submitButton.disabled = true;
        this.errorElement.textContent = '';

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe')?.checked;

        try {
            this.submitButton.textContent = 'Logging in...';
            await userManager.login(username, password);
            
            if (rememberMe) {
                localStorage.setItem('rememberedUser', JSON.stringify({ username }));
            } else {
                localStorage.removeItem('rememberedUser');
            }

            showNotification('Login successful!', 'success');
            this.submitButton.textContent = 'Success!';
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 500);
        } catch (error) {
            showNotification(error.message, 'error');
            this.submitButton.textContent = 'Login';
            this.submitButton.disabled = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LoginHandler();
});