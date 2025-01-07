/**
 * register.js
 * Handles user registration form functionality and validation.
 */

import userManager from './auth.js';

class RegisterHandler {
    constructor() {
        // Select form and related elements
        this.form = document.getElementById('registerForm'); // Registration form element
        this.errorElement = document.getElementById('registerError'); // Element for displaying error messages
        this.submitButton = document.getElementById('submitButton'); // Submit button for the form

        // Select elements related to password inputs
        this.passwordInput = document.getElementById('password'); // Password input field
        this.confirmPasswordInput = document.getElementById('confirmPassword'); // Confirm password input field
        this.togglePasswordButtons = document.querySelectorAll('.toggle-password'); // Buttons to toggle password visibility

        this.initialize();
    }

    /**
     * Initializes event listeners for form submission and password visibility toggling.
     */
    initialize() {
        // Handle form submission
        this.form.addEventListener('submit', this.handleSubmit.bind(this));

        // Add event listeners to toggle password visibility for all toggle buttons
        this.togglePasswordButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Get the associated password input field
                const input = e.target.previousElementSibling;
                this.togglePasswordVisibility(input, e.target);
            });
        });
    }

    /**
     * Toggles the visibility of a password input field.
     * @param {HTMLInputElement} input - The password input field.
     * @param {HTMLElement} button - The button that toggles visibility.
     */
    togglePasswordVisibility(input, button) {
        const isPassword = input.type === 'password'; // Check if the current type is 'password'
        input.type = isPassword ? 'text' : 'password'; // Switch between 'password' and 'text'
        button.textContent = isPassword ? '🔒' : '👁️'; // Update the button icon
    }

    /**
     * Handles the form submission for user registration.
     * @param {Event} e - The form submission event.
     */
    async handleSubmit(e) {
        e.preventDefault(); // Prevent the default form submission behavior

        const username = document.getElementById('username').value.trim(); // Get the username input
        const password = document.getElementById('password').value; // Get the password input
        const email = document.getElementById('email').value.trim(); // Get the email input
        const fullName = document.getElementById('fullName').value.trim(); // Get the full name input

        console.log("Form data:", { username, password, email, fullName }); // Log the form data for debugging

        try {
            // Attempt to register the user
            await userManager.register(username, password, email, fullName);
            console.log("Registration successful");

            // Log the user in automatically after successful registration
            await userManager.login(username, password);
            window.location.href = '../index.html'; // Redirect to the main page
        } catch (error) {
            // Display error message if registration fails
            this.errorElement.textContent = error.message;
            console.error("Registration error:", error);
        }
    }
}

// Initialize the registration handler once the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new RegisterHandler();
});
