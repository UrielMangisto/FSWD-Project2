/**
 * auth.js
 * Module for managing users and permissions in the system.
 * 
 * This file contains the UserManager class, responsible for handling user authentication,
 * registration, session management, and interactions with game-related data.
 */

class UserManager {
    /**
     * Constructor initializes user data, manages inactivity sessions, 
     * and ensures game data is set up correctly.
     */
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || []; // Array of registered users
        this.currentUser = null; // Currently logged-in user
        this.loginAttempts = JSON.parse(localStorage.getItem('loginAttempts')) || {}; // Login attempts tracking
        this.inactivityTimeout = null; // Timer for user inactivity
        
        // Attach event listeners to reset the inactivity timer on user actions
        if (typeof window !== 'undefined') {
            ['click', 'keypress', 'scroll'].forEach(event => {
                document.addEventListener(event, () => this.resetInactivityTimer());
            });
        }

        // Initialize games data if not present
        const gamesData = JSON.parse(localStorage.getItem('gamesData'));
        if (!gamesData) {
            this.initializeGamesData();
        }

        // Periodically check cookie validity
        setInterval(() => {
            if (this.currentUser && !this.checkCookieValid()) {
                this.logout();
                alert('Session expired. Please login again.');
                window.location.href = 'html/login.html';
            }
        }, 5000); // Check every 5 seconds
    }

    /**
     * Resets the inactivity timer. Logs the user out if the timeout expires.
     */
    resetInactivityTimer() {
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
        }
        
        if (this.currentUser) {
            this.inactivityTimeout = setTimeout(() => {
                this.logout();
                alert('Session expired due to inactivity. Please login again.');
                window.location.href = 'html/login.html';
            }, 1 * 60 * 1000); // 1 minute timeout
            
            // Update cookie expiration
            const expires = new Date();
            expires.setMinutes(expires.getMinutes() + 1);
            document.cookie = `loggedInUser=${this.currentUser};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
        }
    }

    /**
     * Checks if the current user's cookie is still valid.
     * @returns {boolean} True if the cookie is valid, false otherwise.
     */
    checkCookieValid() {
        return document.cookie
            .split('; ')
            .some(row => row.startsWith('loggedInUser='));
    }

    /**
     * Initializes default games data if it doesn't already exist.
     */
    initializeGamesData() {
        const gamesData = [
            {
                gameName: "Racing Game",
                players: []
            },
            {
                gameName: "Math Quiz Master",
                players: []
            }
        ];

        this.users.forEach(user => {
            gamesData.forEach(game => {
                game.players.push({
                    name: user.username,
                    score: 0
                });
            });
        });

        localStorage.setItem('gamesData', JSON.stringify(gamesData));
    }

    /**
     * Registers a new user with the system.
     * @param {string} username - The username of the new user.
     * @param {string} password - The password of the new user.
     * @param {string} email - The email address of the new user.
     * @param {string} fullName - The full name of the new user.
     * @returns {boolean} True if registration is successful.
     */
    register(username, password, email, fullName) {
        if (this.users.find(u => u.username === username)) {
            throw new Error('Username already exists');
        }

        const newUser = {
            username,
            password,
            email,
            fullName,
            joinDate: new Date().toISOString(),
            lastLogin: null
        };

        // Add new user to game data
        const gamesData = JSON.parse(localStorage.getItem('gamesData'));
        gamesData.forEach(game => {
            game.players.push({
                name: username,
                score: 0
            });
        });
        localStorage.setItem('gamesData', JSON.stringify(gamesData));

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        return true;
    }

    /**
     * Logs a user into the system.
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {boolean} True if login is successful.
     */
    login(username, password) {
        const attempts = this.loginAttempts[username] || { count: 0, timestamp: null };
        const now = Date.now();

        // Check for account lockout
        if (attempts.count >= 3 && now - attempts.timestamp < 30 * 60 * 1000) {
            const minutesLeft = Math.ceil((30 * 60 * 1000 - (now - attempts.timestamp)) / 60000);
            throw new Error(`Account locked. Try again in ${minutesLeft} minutes.`);
        }

        const user = this.users.find(u => 
            u.username === username && u.password === password
        );

        if (!user) {
            attempts.count = (attempts.count || 0) + 1;
            attempts.timestamp = now;
            this.loginAttempts[username] = attempts;
            localStorage.setItem('loginAttempts', JSON.stringify(this.loginAttempts));
            const remainingAttempts = 3 - attempts.count;
            throw new Error(`Invalid username or password. ${remainingAttempts} attempts remaining.`);
        }

        // Reset login attempts on successful login
        delete this.loginAttempts[username];
        localStorage.setItem('loginAttempts', JSON.stringify(this.loginAttempts));

        user.lastLogin = new Date().toISOString();
        this.currentUser = username;
        localStorage.setItem('users', JSON.stringify(this.users));

        // Set cookie and start inactivity timer
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 2);
        document.cookie = `loggedInUser=${username};expires=${expires.toUTCString()};path=/;SameSite=Strict`;

        this.resetInactivityTimer();

        return true;
    }

    /**
     * Logs out the current user.
     */
    logout() {
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
        }
        this.currentUser = null;
        document.cookie = 'loggedInUser=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }

    /**
     * Retrieves the currently logged-in user.
     * @returns {object|null} The current user object or null if no user is logged in.
     */
    getCurrentUser() {
        if (!this.currentUser) {
            const cookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('loggedInUser='));
                
            if (cookie) {
                this.currentUser = cookie.split('=')[1];
            }
        }
        return this.currentUser ? this.users.find(u => u.username === this.currentUser) : null;
    }

    /**
     * Updates the score of the logged-in user for a specific game.
     * @param {string} gameName - The name of the game.
     * @param {number} score - The new score to update.
     * @returns {boolean} True if the score was updated, false otherwise.
     */
    updateUserScore(gameName, score) {
        const user = this.getCurrentUser();
        if (!user) return false;
            
        const gamesData = JSON.parse(localStorage.getItem('gamesData'));
        const game = gamesData.find(g => g.gameName === gameName);

        if (game) {
            const player = game.players.find(p => p.name === user.username);
            if (player && score > player.score) {
                player.score = score;
                localStorage.setItem('gamesData', JSON.stringify(gamesData));
                return true;
            }
        }
        return false;
    }
}
 
const userManager = new UserManager();
export default userManager;
