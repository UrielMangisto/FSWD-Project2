/**
 * RacingGame.js
 * משחק מירוץ מכוניות עם מכשולים ורמות קושי
 */

import userManager from './auth.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// הגדרות המשחק
canvas.width = 400;
canvas.height = 600;

let isRunning = false;
let player = { x: 180, y: 500, width: 40, height: 60, image: new Image() };
player.image.src = "../images/car.png";

let obstacles = [];
let score = 0;
let speed = 3;
let difficulty = "noSelect"; 
let obstacleFrequency = 0.03;

// טעינת תמונות
const logImage = new Image();
logImage.src = "../images/log.png";

const tireImage = new Image();
tireImage.src = "../images/tire.png";

// ציור הרקע והנתיבים
const drawRoad = () => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 20]);
    for (let i = 80; i < canvas.width; i += 80) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
};

const drawPlayer = () => {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
};

const generateObstacle = () => {
    const type = Math.random() < 0.5 ? "log" : "tire";
    const width = type === "log" ? 80 : 40;
    const height = 30;
    const x = Math.random() * (canvas.width - width);

    obstacles.push({ x, y: -height, width, height, type });
};

const drawObstacles = () => {
    obstacles.forEach((obs) => {
        if (obs.type === "log") {
            ctx.drawImage(logImage, obs.x, obs.y, obs.width, obs.height);
        } else {
            ctx.drawImage(tireImage, obs.x, obs.y, obs.width, obs.height);
        }
    });
};

// הגדרת רמת קושי
const setDifficulty = (selectedDifficulty) => {
    difficulty = selectedDifficulty;

    switch (difficulty) {
        case "easy":
            speed = 4;
            obstacleFrequency = 0.04;
            break;
        case "medium":
            speed = 5.5;
            obstacleFrequency = 0.03;
            break;
        case "hard":
            speed = 7;
            obstacleFrequency = 0.05;
            break;
        default:
            speed = 3;
            obstacleFrequency = 0.03;
    }
};

// עדכון המשחק
const updateGame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoad();
    drawPlayer();
    drawObstacles();

    obstacles.forEach((obs, index) => {
        obs.y += speed;

        // בדיקת התנגשות
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            stopGame();
        }

        // מחיקת מכשול שיצא מהמסך והוספת ניקוד
        if (obs.y > canvas.height) {
            obstacles.splice(index, 1);
            score += 1;
        }
    });

    // הוספת מכשול חדש
    if (Math.random() < obstacleFrequency) {
        generateObstacle();
    }

    // הצגת ניקוד
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (isRunning) {
        requestAnimationFrame(updateGame);
    }
};

// התחלת משחק
const startGame = () => {
    if (difficulty === "noSelect") {
        return;
    }
    
    isRunning = true;
    obstacles = [];
    score = 0;
    player.x = 180;
    player.y = 500;
    
    // הסתרת מסך סיום אם קיים
    const gameOverScreen = document.getElementById("game-over-screen");
    if (gameOverScreen) {
        gameOverScreen.style.display = "none";
    }
    
    updateGame();
};

// עצירת המשחק
const stopGame = () => {
    isRunning = false;
    
    // עדכון התוצאה
    userManager.updateUserScore("Racing Game", score);
    
    // הצגת מסך סיום
    const gameOverScreen = document.getElementById("game-over-screen");
    gameOverScreen.style.display = "flex";
    document.getElementById("final-score").textContent = `Your Score: ${score}`;
};

// מאזיני אירועים

// שליטה במכונית
window.addEventListener("keydown", (e) => {
    if (!isRunning) return;
    
    if (e.key === "ArrowLeft" && player.x > 0) {
        player.x -= 10;
    }
    if (e.key === "ArrowRight" && player.x + player.width < canvas.width) {
        player.x += 10;
    }
});

// בחירת רמת קושי
document.querySelectorAll(".difficulty-button").forEach((button) => {
    button.addEventListener("click", (e) => {
        const selectedDifficulty = e.target.getAttribute("data-difficulty");
        setDifficulty(selectedDifficulty);

        document.getElementById("difficulty-selection").style.display = "none";
    });
});

// אתחול המשחק
document.addEventListener("DOMContentLoaded", () => {
    drawRoad();
    drawPlayer();
});

// כפתורי משחק
document.getElementById("startButton").addEventListener("click", startGame);

document.getElementById("restartButton").addEventListener("click", () => {
    document.getElementById("difficulty-selection").style.display = "block";
    document.getElementById("game-over-screen").style.display = "none";
});

document.getElementById("userInfoButton").addEventListener("click", () => {
    window.location.href = "../html/userInfo.html";
});