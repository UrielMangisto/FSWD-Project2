import userManager from './auth.js';

// Select DOM elements
const gameContainer = document.getElementById("game-container");
const scoreElement = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");
const finalScoreElement = document.getElementById("final-score");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const resultsButton = document.createElement("button"); // Button to view game results
const difficultySelection = document.getElementById("difficulty-selection");
const player = document.createElement("div");

// Game variables
let isRunning = false;
let obstacles = [];
let score = 0;
let speed = 3;
let obstacleFrequency = 2000; // milliseconds
let difficulty = "noSelect";
let obstacleInterval;
let gameInterval;

// Create player element
player.id = "player";
gameContainer.appendChild(player);

// Set difficulty level
const setDifficulty = (selectedDifficulty) => {
    difficulty = selectedDifficulty;

    switch (difficulty) {
        case "easy":
            speed = 4;
            obstacleFrequency = 2500;
            break;
        case "medium":
            speed = 5.5;
            obstacleFrequency = 2000;
            break;
        case "hard":
            speed = 7;
            obstacleFrequency = 1500;
            break;
        default:
            speed = 3;
            obstacleFrequency = 2000;
    }

    // Hide difficulty selection and show the start button
    difficultySelection.style.display = "none";
    startButton.style.display = "block";
};

// Create an obstacle
const createObstacle = () => {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.left = `${Math.random() * (gameContainer.clientWidth - 40)}px`;
    obstacle.style.top = "-40px";
    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);
};

// Update game logic
const updateGame = () => {
    if (!isRunning) return;

    obstacles.forEach((obstacle, index) => {
        const currentTop = parseFloat(obstacle.style.top);
        obstacle.style.top = `${currentTop + speed}px`;

        // Check for collision
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            playerRect.left < obstacleRect.right &&
            playerRect.right > obstacleRect.left &&
            playerRect.top < obstacleRect.bottom &&
            playerRect.bottom > obstacleRect.top
        ) {
            stopGame();
        }

        // Remove obstacles that move out of bounds
        if (currentTop > gameContainer.clientHeight) {
            obstacle.remove();
            obstacles.splice(index, 1);
            score++;
            scoreElement.textContent = `Score: ${score}`;
        }
    });
};

// Start the game
const startGame = () => {
    if (difficulty === "noSelect") {
        alert("Please select a difficulty level first!");
        return;
    }

    isRunning = true;
    obstacles = [];
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    player.style.left = `${gameContainer.clientWidth / 2 - player.offsetWidth / 2}px`;

    gameOverScreen.style.display = "none";
    startButton.style.display = "none";

    // Create obstacles at intervals
    obstacleInterval = setInterval(createObstacle, obstacleFrequency);

    // Update the game
    gameInterval = setInterval(updateGame, 16); // ~60fps
};

// Stop the game
const stopGame = () => {
    isRunning = false;
    clearInterval(obstacleInterval);
    clearInterval(gameInterval);

    userManager.updateUserScore("Racing Game", score);

    gameOverScreen.style.display = "flex";
    finalScoreElement.textContent = `Your Score: ${score}`;

    // Add "View Results" button
    resultsButton.id = "results-button";
    resultsButton.textContent = "View Results";
    resultsButton.classList.add("btn");
    resultsButton.onclick = () => {
        window.location.href = "./userInfo.html"; // Navigate to the results page
    };

    gameOverScreen.appendChild(resultsButton); // Append the button only once
    
};

// Player controls
window.addEventListener("keydown", (e) => {
    if (!isRunning) return;

    const playerMove = parseFloat(player.style.left);

    if (e.key === "ArrowLeft" && playerMove > 0) {
        player.style.left = `${playerMove - 10}px`;
    } else if (e.key === "ArrowRight" && playerMove + player.offsetWidth < gameContainer.clientWidth) {
        player.style.left = `${playerMove + 10}px`;
    }
});

// Listen for difficulty selection
document.querySelectorAll(".difficulty-button").forEach((button) => {
    button.addEventListener("click", (e) => {
        const selectedDifficulty = e.target.getAttribute("data-difficulty");
        setDifficulty(selectedDifficulty);
    });
});

// Listen for game start button
startButton.addEventListener("click", startGame);

// Listen for restart button
restartButton.addEventListener("click", () => {
    // Reset difficulty selection and game-over screen visibility
    difficultySelection.style.display = "block";
    gameOverScreen.style.display = "none";
    startButton.style.display = "none"; // Hide start button until difficulty is selected again

    // Remove all existing obstacles from the game container
    obstacles.forEach(obstacle => obstacle.remove());
    obstacles = []; // Clear the obstacles array to ensure a fresh start

    // Reset the player's position (optional)
    player.style.left = `${gameContainer.clientWidth / 2 - player.offsetWidth / 2}px`;

    // Reset score display
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
});


// DOM content loaded actions
document.addEventListener("DOMContentLoaded", () => {
    difficultySelection.style.display = "block"; // Ensure difficulty selection is visible on page load
    startButton.style.display = "none"; // Hide start button initially
    gameOverScreen.style.display = "none"; // Hide game over screen initially
});
