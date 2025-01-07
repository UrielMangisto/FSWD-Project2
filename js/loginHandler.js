/**
 * loginHandler.js
 * Handles the login form and user authentication flow.
 */

import userManager from './auth.js';

class LoginHandler {
    constructor() {
        // Get references to form elements
        this.form = document.getElementById('loginForm'); // The login form element
        this.errorElement = document.getElementById('loginError'); // Element to display error messages
        this.submitButton = document.getElementById('submitButton'); // The form's submit button
        this.passwordInput = document.getElementById('password'); // Password input field
        this.togglePasswordButton = document.querySelector('.toggle-password'); // Button to toggle password visibility

        this.initialize();
    }

    /**
     * Adds event listeners for form submission and password toggle.
     */
    initialize() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this)); // Handle form submission
        this.togglePasswordButton.addEventListener('click', this.togglePasswordVisibility.bind(this)); // Toggle password visibility
    }

    /**
     * Toggles the visibility of the password field.
     * Changes the input type between 'password' and 'text' and updates the button's icon.
     */
    togglePasswordVisibility() {
        const isPassword = this.passwordInput.type === 'password'; // Check if the input type is currently 'password'
        this.passwordInput.type = isPassword ? 'text' : 'password'; // Switch the input type
        this.togglePasswordButton.textContent = isPassword ? '🔒' : '👁️'; // Update the button icon
    }

    /**
     * Handles the form submission.
     * Tries to log the user in and redirects them on success, or shows an error message on failure.
     * @param {Event} e - The form submission event.
     */
    async handleSubmit(e) {
        e.preventDefault(); // Prevent the form's default submission behavior

        const username = document.getElementById('username').value.trim(); // Get the username value
        const password = document.getElementById('password').value; // Get the password value

        try {
            // Attempt to log the user in using the UserManager
            await userManager.login(username, password);
            window.location.href = '../index.html'; // Redirect to the main page on success
        } catch (error) {
            // Display an error message if login fails
            this.errorElement.textContent = error.message;
        }
    }
}

// Initialize the LoginHandler when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginHandler();
});
