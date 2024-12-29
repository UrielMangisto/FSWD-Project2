// registerHandler.js
import userManager from './auth.js';
import { showNotification, validateEmail, setupPasswordToggles } from './utils.js';

class RegisterHandler {
    constructor() {
        this.form = document.getElementById('registerForm');
        this.errorElement = document.getElementById('registerError');
        this.submitButton = document.getElementById('submitButton');
        this.setupPasswordStrength();
        this.initialize();
        setupPasswordToggles();
    }

    initialize() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.setupPasswordConfirmation();
        this.setupInputValidation();
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('password');
        this.passwordStrengthElement = document.createElement('div');
        this.passwordStrengthElement.className = 'password-strength';
        passwordInput.parentNode.insertBefore(this.passwordStrengthElement, passwordInput.nextSibling);
        
        passwordInput.addEventListener('input', this.checkPasswordStrength.bind(this));
    }

    checkPasswordStrength(e) {
        const password = e.target.value;
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const strengthText = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
        const strengthClass = ['weak', 'fair', 'good', 'strong', 'excellent'];
        
        if (strength > 0) {
            this.passwordStrengthElement.textContent = `Password Strength: ${strengthText[strength-1]}`;
            this.passwordStrengthElement.className = `password-strength ${strengthClass[strength-1]}`;
        } else {
            this.passwordStrengthElement.textContent = '';
            this.passwordStrengthElement.className = 'password-strength';
        }
    }

    setupPasswordConfirmation() {
        const passwordInput = document.getElementById('password');
        const confirmInput = document.getElementById('confirmPassword');
        
        confirmInput.addEventListener('input', () => {
            if (passwordInput.value !== confirmInput.value) {
                this.showError('Passwords do not match');
                this.submitButton.disabled = true;
            } else {
                this.clearError();
                this.submitButton.disabled = false;
            }
        });
    }

    setupInputValidation() {
        this.form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', this.validateInput.bind(this));
        });
        
        const emailInput = document.getElementById('email');
        emailInput.addEventListener('input', (e) => {
            if (!validateEmail(e.target.value)) {
                this.showError('Invalid email format');
                this.submitButton.disabled = true;
            } else {
                this.clearError();
                this.submitButton.disabled = false;
            }
        });
    }

    validateInput(e) {
        const input = e.target;
        const value = input.value.trim();
        
        switch(input.id) {
            case 'fullName':
                if (!/^[A-Za-z\s]{2,}$/.test(value)) {
                    this.showError('Full name must contain only letters and be at least 2 characters');
                    return false;
                }
                break;
            case 'username':
                if (!/^[A-Za-z0-9]{3,16}$/.test(value)) {
                    this.showError('Username must be 3-16 characters and contain only letters and numbers');
                    return false;
                }
                break;
            case 'password':
                if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(value)) {
                    this.showError('Password must be at least 8 characters and contain at least one letter and one number');
                    return false;
                }
                break;
        }

        this.clearError();
        return true;
    }

    showError(message) {
        this.errorElement.textContent = message;
        this.submitButton.disabled = true;
    }

    clearError() {
        this.errorElement.textContent = '';
        if (!this.form.querySelector('input:invalid')) {
            this.submitButton.disabled = false;
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.submitButton.disabled = true;
        this.errorElement.textContent = '';

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const email = document.getElementById('email').value.trim();
        const fullName = document.getElementById('fullName').value.trim();

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        if (!validateEmail(email)) {
            this.showError('Invalid email format');
            return;
        }

        try {
            this.submitButton.textContent = 'Registering...';
            await userManager.register(username, password, email, fullName);
            showNotification('Registration successful!', 'success');
            
            // Auto login after registration
            await userManager.login(username, password);
            this.submitButton.textContent = 'Success!';
            
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 500);
        } catch (error) {
            showNotification(error.message, 'error');
            this.submitButton.textContent = 'Register';
            this.submitButton.disabled = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RegisterHandler();
});