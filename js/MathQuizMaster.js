/**
 * MathQuizMaster.js
 * A simple math quiz game with a timer and scoring system.
 */

import userManager from './auth.js';

// Basic game settings
let score = 0; // Player's score
let timeLeft = 30; // Time left in seconds
let currentQuestion = {}; // The current math question
let timer; // Interval timer for countdown

// Select DOM elements
const questionElement = document.getElementById("question"); // Displays the current question
const answerInput = document.getElementById("answer"); // Input field for the answer
const submitButton = document.getElementById("submit-answer"); // Button to submit the answer
const feedbackElement = document.getElementById("feedback"); // Displays feedback (correct/wrong)
const scoreElement = document.getElementById("score"); // Displays the player's score
const timeElement = document.getElementById("time"); // Displays the remaining time
const startButton = document.getElementById("start-game"); // Button to start the game
const quizSection = document.getElementById("quiz-section"); // Section containing the quiz UI
const footer = document.querySelector("footer"); // Footer section for additional details

/**
 * Generates a random math question and updates the UI.
 */
const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1; // Random number between 1-10
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ["+", "-", "*"];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let answer;

    switch (operator) {
        case "+":
            answer = num1 + num2;
            break;
        case "-":
            answer = num1 - num2;
            break;
        case "*":
            answer = num1 * num2;
            break;
    }

    currentQuestion = { num1, num2, operator, answer };
    questionElement.textContent = `What is ${num1} ${operator} ${num2}?`; // Update question in UI
};

/**
 * Checks if the player's answer is correct.
 * Updates score and generates a new question.
 */
const checkAnswer = () => {
    if (timeLeft === 30) {
        return; // Prevent interaction before the game starts
    }

    const userAnswer = parseInt(answerInput.value, 10); // Get and parse the player's answer

    if (userAnswer === currentQuestion.answer) {
        score += 10; // Increment score for correct answer
        feedbackElement.textContent = "Correct! 🎉"; // Positive feedback
        feedbackElement.style.color = "green";
    } else {
        feedbackElement.textContent = "Wrong! 😔"; // Negative feedback
        feedbackElement.style.color = "red";
    }

    scoreElement.textContent = score; // Update score in UI
    answerInput.value = ""; // Clear input field
    generateQuestion(); // Generate a new question
};

/**
 * Starts the game, resets values, and initializes the timer.
 */
const startGame = () => {
    // Reset game values
    score = 0;
    timeLeft = 30;
    scoreElement.textContent = score;
    timeElement.textContent = timeLeft;
    feedbackElement.textContent = "";

    // Show game UI and hide the start button
    quizSection.style.display = "block";
    footer.style.display = "block";
    startButton.style.display = "none";

    // Enable inputs
    submitButton.disabled = false;
    answerInput.disabled = false;

    generateQuestion(); // Generate the first question

    // Start the countdown timer
    timer = setInterval(() => {
        timeLeft -= 1;
        timeElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer); // Stop the timer when time runs out
            endGame(); // End the game
        }
    }, 1000);
};

/**
 * Ends the game, shows the final score, and updates the user's data.
 */
const endGame = () => {
    questionElement.textContent = "Game Over! 🎮"; // Show end message
    feedbackElement.textContent = `Your final score: ${score}`; // Show final score
    feedbackElement.style.color = "blue";

    // Update the player's score in the system
    userManager.updateUserScore("Math Quiz Master", score);

    // Disable inputs
    submitButton.disabled = true;
    answerInput.disabled = true;
};

/**
 * Event Listeners
 */
submitButton.addEventListener("click", checkAnswer); // Handle answer submission
startButton.addEventListener("click", startGame); // Start the game
answerInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        checkAnswer(); // Check answer when "Enter" is pressed
    }
});

/**
 * Resets the game UI on page load.
 */
document.addEventListener('DOMContentLoaded', () => {
    quizSection.style.display = "none"; // Hide the quiz section
    footer.style.display = "none"; // Hide the footer
    startButton.style.display = "block"; // Show the start button
    submitButton.disabled = true; // Disable the submit button
    answerInput.disabled = true; // Disable the answer input field
});
