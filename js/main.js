/**
 * main.js
 * Manages the display of games on the page and handles user login checks.
 */

import userManager from './auth.js';

// List of games with their details
const games = [
    {
        id: 'racing',
        name: 'Racing Game',
        image: './images/car.png',
        video: './videos/racing.mp4',
        path: './html/RacingGame.html',
        active: true
    },
    {
        id: 'math',
        name: 'Math Quiz Master',
        image: './images/Math.png',
        path: './html/MathQuizMaster.html',
        active: true
    },
    {
        id: 'puzzle',
        name: 'Puzzle Master',
        image: './images/Puzzle_Master.png',
        path: '#',
        active: false
    },
    {
        id: 'memory',
        name: 'Memory Game',
        image: './images/Memory_Game.png',
        path: '#',
        active: false
    },
    {
        id: 'trivia',
        name: 'Trivia Challenge',
        image: './images/Trivia_Challenge.png',
        path: '#',
        active: false
    },
    {
        id: 'snake',
        name: 'Snake Classic',
        image: './images/Snake_Classic.png',
        path: '#',
        active: false
    }
];

/**
 * Displays the games on the page.
 * Filters games based on the "filter" query parameter (e.g., "active" games only).
 */
function displayGames() {
    const gamesSection = document.getElementById('games'); // Section to display games
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter'); // Get filter from query parameters

    if (!gamesSection) return;

    gamesSection.innerHTML = ''; // Clear existing games

    // Filter games based on the query parameter
    const filteredGames = filter ? 
        games.filter(game => filter === 'active' ? game.active : !game.active) 
        : games;

    // Create game cards
    filteredGames.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.setAttribute('data-game-id', game.id);
        
        if (game.active) {
            // Active game card with link and video (if available)
            gameCard.innerHTML = `
                <a href="${game.path}" class="game-link">
                    <img src="${game.image}" alt="${game.name}" class="game-image">
                    ${game.video ? `<video class="game-video" loop muted preload="auto">
                        <source src="${game.video}" type="video/mp4">
                    </video>` : ''}
                    <h3 class="active-game-title">${game.name}</h3>
                </a>
            `;

            // Add hover events for videos
            if (game.video) {
                const video = gameCard.querySelector('video');
                gameCard.addEventListener('mouseenter', () => {
                    video.play();
                });
                gameCard.addEventListener('mouseleave', () => {
                    video.pause();
                    video.currentTime = 0;
                });
            }
        } else {
            // Inactive game card with "Coming Soon" overlay
            gameCard.innerHTML = `
                <div class="game-link">
                    <img src="${game.image}" alt="${game.name}" class="game-image">
                    <h3 class="soon-game-title">${game.name}</h3>
                    <div class="coming-soon-overlay">
                        <span>Coming Soon!</span>
                    </div>
                </div>
            `;
        }
        
        gamesSection.appendChild(gameCard);
    });
}

/**
 * Checks if a user is logged in. Redirects to the login page if not logged in.
 */
function checkLoginStatus() {
    const currentUser = userManager.getCurrentUser();
    if (!currentUser) {
        const currentPage = window.location.pathname.split('/').pop();
        // Allow access only to public pages
        if (!['', 'index.html', 'login.html', 'register.html'].includes(currentPage)) {
            window.location.href = 'html/login.html';
        }
    } else {
        updateGreeting(currentUser);
    }
}

/**
 * Updates the greeting message and adds user-specific options in the UI.
 * @param {object} user - The logged-in user's details.
 */
function updateGreeting(user) {
    const userGreeting = document.getElementById('userGreeting');
    const loginButton = document.getElementById('loginButton');
    const profileLink = document.getElementById('profileLink');
    const usernameSpan = document.getElementById('username');
    
    if (!userGreeting || !loginButton || !profileLink || !usernameSpan) {
        console.log('Missing elements:', { userGreeting, loginButton, profileLink, usernameSpan });
        return;
    }
    
    loginButton.style.display = 'none'; // Hide the login button
    userGreeting.style.display = 'block'; // Show the greeting section
    profileLink.style.display = 'block'; // Show the profile link
    usernameSpan.textContent = user.username; // Display the username

    // Add a logout button if it doesn't exist
    if (!document.getElementById('logoutButton')) {
        const logoutButton = document.createElement('button');
        logoutButton.id = 'logoutButton';
        logoutButton.className = 'btn btn-secondary';
        logoutButton.textContent = 'Logout';
        logoutButton.onclick = () => {
            userManager.logout(); // Log the user out
            window.location.href = './html/login.html';
        };
        userGreeting.appendChild(logoutButton);
    }
}

// When the page loads, check the login status and display games
document.addEventListener('DOMContentLoaded', async () => {
    const user = userManager.getCurrentUser();
    console.log('Current user:', user);
    console.log('Games data:', JSON.parse(localStorage.getItem('gamesData')));
    if (user) {
        updateGreeting(user);
    } else {
        checkLoginStatus();
    }
    displayGames();
});
