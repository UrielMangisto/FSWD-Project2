import userManager from './auth.js';
import { gamesData, getTopScores } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    // בדיקת התחברות
    checkLoginStatus();
    
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
            ${game.status === 'active' ? `<a href="${game.id}.html" class="play-button">שחק עכשיו</a>` : ''}
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
    
    getDifficulty: (gameId) => {
        return gamesData[gameId]?.difficulty || null;
    },
    
    getTopScores: getTopScores
};