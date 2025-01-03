import userManager from './auth.js';

const games = [
    {
        id: 'racing',
        name: 'Racing Game',
        image: './images/car.png',
        path: './html/RacingGame.html',
        active: true
    },
    {
        id: 'math',
        name: 'Math Quiz Master',
        image: './images/Math.png',
        path: './html/MathQuizMaster.html',
        active: true
    }
];

function displayGames() {
    const gamesSection = document.getElementById('games');
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter') || 'active';

    if (!gamesSection) return;

    gamesSection.innerHTML = '';
    
    const filteredGames = games.filter(game => 
        filter === 'active' ? game.active : !game.active
    );

    filteredGames.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        
        gameCard.innerHTML = `
            <a href="${game.path}" class="game-link">
                <img src="${game.image}" alt="${game.name}" class="game-image">
                <h3 class="game-title">${game.name}</h3>
            </a>
        `;
        
        gamesSection.appendChild(gameCard);
    });
}

function displayUserInfo() {
    const userElement = document.getElementById('userInfo');
    if (userElement) {
        const currentUser = userManager.getCurrentUser();
        if (currentUser) {
            userElement.innerHTML = `
                <div class="user-welcome">
                    <h3>Hello ${currentUser.username}</h3>
                    <p>Last login: ${new Date(currentUser.lastLogin).toLocaleString()}</p>
                    <div class="user-stats">
                        <p>Current scores: ${currentUser.scores?.length || 0}</p>
                    </div>
                    <button id="logoutBtn" class="logout-btn">Logout</button>
                </div>
            `;
            
            document.getElementById('logoutBtn').addEventListener('click', () => {
                userManager.logout();
                window.location.href = 'login.html';
            });
        }
    }
}

function checkLoginStatus() {
    const currentUser = userManager.getCurrentUser();
    if (!currentUser) {
        const currentPage = window.location.pathname.split('/').pop();
        if (!['', 'index.html', 'login.html', 'register.html'].includes(currentPage)) {
            window.location.href = 'html/login.html';
        }
    } else {
        updateGreeting(currentUser);
    }
}

function updateGreeting(user) {
    const userGreeting = document.getElementById('userGreeting');
    const loginButton = document.getElementById('loginButton');
    const profileLink = document.getElementById('profileLink');
    const usernameSpan = document.getElementById('username');
    
    if (!userGreeting || !loginButton || !profileLink || !usernameSpan) {
        console.log('Missing elements:', { userGreeting, loginButton, profileLink, usernameSpan });
        return;
    }
    
    loginButton.style.display = 'none';
    userGreeting.style.display = 'block';
    profileLink.style.display = 'block';
    usernameSpan.textContent = user.username;
}

document.addEventListener('DOMContentLoaded', async () => {
    const user = userManager.getCurrentUser();
    console.log('Current user:', user);
    console.log('Games data:', JSON.parse(localStorage.getItem('gamesData')));
    if (user) {
        updateGreeting(user);
        displayUserInfo();
    } else {
        checkLoginStatus();
    }
    displayGames();
});

export function updateGameScore(gameId, score) {
    userManager.updateUserScore(gameId, score);
}