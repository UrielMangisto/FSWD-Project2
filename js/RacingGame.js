import updateGameData from './userInfo.js';
import online from './dataUsers.js';
import userManager from './auth.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// הגדרות המשחק
canvas.width = 400;
canvas.height = 600;

let isRunning = false;
let player = { x: 180, y: 500, width: 40, height: 60, image: new Image() };
player.image.src = "../images/car.png"; // טוענים את תמונת הרכב

let obstacles = [];
let score = 0;
let speed = 3;
let difficulty = "noSelect"; 
let obstacleFrequency = 0.03; // תדירות ברירת מחדל ליצירת מכשולים

// טעינת תמונות
const logImage = new Image();
logImage.src = "../images/log.png";

const tireImage = new Image();
tireImage.src = "../images/tire.png";


// פונקציה לציור הרקע (כביש עם נתיבים)
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

// ציור שחקן
const drawPlayer = () => {
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
};

// יצירת מכשול
const generateObstacle = () => {
  const type = Math.random() < 0.5 ? "log" : "tire";
  const width = type === "log" ? 80 : 40;
  const height = 30;
  const x = Math.random() * (canvas.width - width);

  obstacles.push({ x, y: -height, width, height, type });
};

// ציור מכשולים
const drawObstacles = () => {
  obstacles.forEach((obs) => {
    if (obs.type === "log") {
      ctx.drawImage(logImage, obs.x, obs.y, obs.width, obs.height);
    } else {
      ctx.drawImage(tireImage, obs.x, obs.y, obs.width, obs.height);
    }
  });
};

// פונקציה להגדרת רמת קושי
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

    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      stopGame();
    }

    if (obs.y > canvas.height) {
      obstacles.splice(index, 1);
      score += 1;
    }
  });

  if (Math.random() < obstacleFrequency) {
    generateObstacle();
  }

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);

  if (isRunning) {
    requestAnimationFrame(updateGame);
  }
};

let playerName = online[0]?.name || "Guest"; // שם השחקן
// פונקציית התחלת המשחק
const startGame = () => {
  if(difficulty=="noSelect")
    {
      return;
    }
  isRunning = true;
  obstacles = [];
  score = 0;
  player.x = 180;
  player.y = 500;
  updateGame();
};


// עצירת המשחק
const stopGame = () => {
  isRunning = false;

  // עדכון נתוני המשחק
  updateGameData(playerName, score, "Racing Game");

  userManager.updateUserScore("Racing Game", score);
  
  // שמירת הנתונים המעודכנים ב-Local Storage
  //localStorage.setItem("gamesData", JSON.stringify(gamesData));
  
  console.log(playerName +" "+ score);
  // הצגת מסך הסיום
  const gameOverScreen = document.getElementById("game-over-screen");
  gameOverScreen.style.display = "flex";
  document.getElementById("final-score").textContent = `Your Score: ${score}`;
};

// שליטה בשחקן
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && player.x > 0) player.x -= 10;
  if (e.key === "ArrowRight" && player.x + player.width < canvas.width)
    player.x += 10;
});

// מאזין אירועים לכפתורי רמת הקושי
document.querySelectorAll(".difficulty-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectedDifficulty = e.target.getAttribute("data-difficulty");
    setDifficulty(selectedDifficulty);

    // הסתרת בחירת רמת הקושי והתחלת המשחק
    document.getElementById("difficulty-selection").style.display = "none";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  drawRoad();
  drawPlayer();
});

// כפתור התחלה
document.getElementById("startButton").addEventListener("click", startGame);


// כפתור התחלה מחדש
document.getElementById("restartButton").addEventListener("click", () => {
  // הצגת מסך בחירת רמת הקושי

  document.getElementById("difficulty-selection").style.display = "block";
  document.getElementById("game-over-screen").style.display = "none";
});

// כפתור מעבר לעמוד תוצאות
document.getElementById("userInfoButton").addEventListener("click", () => {
  window.location.href = "../html/userInfo.html";
});
