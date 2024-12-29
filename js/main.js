import userManager from './auth.js';
import { gamesData, getTopScores } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    // בדיקת התחברות
    checkLoginStatus();
    
    // הצגת פרטי משתמש
    displayUserInfo();
    
    const gamesContainer = document.getElementById('games');
    const searchInput = document.getElementById('search');

    if (gamesContainer) {
        // טעינה ראשונית של המשחקים
        loadGames(Object.values(gamesData));

        // טיפול בחיפוש
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchValue = e.target.value.toLowerCase();
                const filteredGames = Object.values(gamesData).filter(game =>
                    game.title.toLowerCase().includes(searchValue)
                );
                loadGames(filteredGames);
            });
        }
    }
});

// הצגת פרטי משתמש וכפתור התנתקות
function displayUserInfo() {
    const userElement = document.getElementById('userInfo');
    if (userElement) {
        const currentUser = userManager.getCurrentUserData();
        if (currentUser) {
            userElement.innerHTML = `
                <div class="user-welcome">
                    <h3>שלום ${currentUser.fullName}</h3>
                    <p>כניסה אחרונה: ${new Date(currentUser.lastLogin).toLocaleString('he-IL')}</p>
                    <div class="user-stats">
                        <p>משחק תנועה: ${currentUser.games.play1.gamesPlayed} משחקים</p>
                        <p>משחק לוגיקה: ${currentUser.games.play2.gamesPlayed} משחקים</p>
                    </div>
                    <button id="logoutBtn" class="logout-btn">התנתק</button>
                </div>
            `;
            
            document.getElementById('logoutBtn').addEventListener('click', () => {
                userManager.logout();
                window.location.href = 'login.html';
            });
        }
    }
}

// בדיקת סטטוס התחברות
function checkLoginStatus() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('loggedInUser='));
    
    if (cookieValue) {
        const username = cookieValue.split('=')[1];
        if (!userManager.getCurrentUserData()) {
            userManager.clearLoginCookie();
            window.location.href = 'login.html';
        }
    } else {
        const currentPage = window.location.pathname.split('/').pop();
        if (!['login.html', 'register.html'].includes(currentPage)) {
            window.location.href = 'login.html';
        }
    }
}

// טעינת המשחקים
function loadGames(games) {
    const gamesContainer = document.getElementById('games');
    gamesContainer.innerHTML = '';

    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');

        const statusClass = game.status === 'active' ? 'new' : 'updated';
        const statusText = game.status === 'active' ? 'פעיל' : 'בקרוב';

        gameCard.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.title}">
            <h3>${game.title}</h3>
            <p>${game.description}</p>
            <span class="badge ${statusClass}">${statusText}</span>
            ${game.status === 'active' ? `
                <div class="game-options">
                    <div class="difficulty-select">
                        <a href="${game.id}.html?difficulty=easy" class="difficulty-btn easy">קל</a>
                        <a href="${game.id}.html?difficulty=medium" class="difficulty-btn medium">בינוני</a>
                        <a href="${game.id}.html?difficulty=hard" class="difficulty-btn hard">קשה</a>
                    </div>
                </div>` : ''
            }
        `;

        if (game.status === 'active') {
            const scores = getTopScores(game.id);
            if (scores.length > 0) {
                const topScore = scores[0];
                gameCard.innerHTML += `
                    <div class="top-score">
                        שיא: ${topScore.score} (${topScore.username})
                    </div>
                `;
            }
        }

        gamesContainer.appendChild(gameCard);
    });
}

// ייצוא פונקציות שימושיות למשחקים
export const gameUtils = {
    updateScore: (gameId, score) => {
        userManager.updateGameStats(gameId, score);
    },
    
    getDifficulty: () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('difficulty') || 'easy';
    },
    
    getGameSettings: (gameId) => {
        const difficulty = gameUtils.getDifficulty();
        return gamesData[gameId]?.difficulty[difficulty] || gamesData[gameId]?.difficulty.easy;
    },
    
    getTopScores: getTopScores
};