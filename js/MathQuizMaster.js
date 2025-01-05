/**
 * MathQuizMaster.js
 * משחק חידון מתמטיקה עם טיימר וניקוד
 */

import userManager from './auth.js';

// הגדרות בסיסיות של המשחק
let score = 0;
let timeLeft = 30;
let currentQuestion = {};
let timer;

// בחירת אלמנטים מה-DOM
const questionElement = document.getElementById("question");
const answerInput = document.getElementById("answer");
const submitButton = document.getElementById("submit-answer");
const feedbackElement = document.getElementById("feedback");
const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const startButton = document.getElementById("start-game");
const quizSection = document.getElementById("quiz-section");
const footer = document.querySelector("footer");

// יצירת שאלה רנדומלית
const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
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
    questionElement.textContent = `What is ${num1} ${operator} ${num2}?`;
};

// בדיקת תשובה
const checkAnswer = () => {
    if(timeLeft === 30) {
        return;
    }
    
    const userAnswer = parseInt(answerInput.value, 10);
    
    if (userAnswer === currentQuestion.answer) {
        score += 10;
        feedbackElement.textContent = "Correct! 🎉";
        feedbackElement.style.color = "green";
    } else {
        feedbackElement.textContent = "Wrong! 😔";
        feedbackElement.style.color = "red";
    }

    scoreElement.textContent = score;
    answerInput.value = "";
    generateQuestion();
};

// התחלת משחק
const startGame = () => {
    // איפוס ערכים
    score = 0;
    timeLeft = 30;
    scoreElement.textContent = score;
    timeElement.textContent = timeLeft;
    feedbackElement.textContent = "";
    
    // הפעלת ממשק המשחק
    quizSection.style.display = "block";
    footer.style.display = "block";
    startButton.style.display = "none";
    
    // איפשור קלט
    submitButton.disabled = false;
    answerInput.disabled = false;

    generateQuestion();

    // התחלת טיימר
    timer = setInterval(() => {
        timeLeft -= 1;
        timeElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
};

// סיום משחק
const endGame = () => {
    questionElement.textContent = "Game Over! 🎮";
    feedbackElement.textContent = `Your final score: ${score}`;
    feedbackElement.style.color = "blue";
    
    // עדכון התוצאה במערכת
    userManager.updateUserScore("Math Quiz Master", score);
    
    // נעילת ממשק המשחק
    submitButton.disabled = true;
    answerInput.disabled = true;
};

// מאזיני אירועים
submitButton.addEventListener("click", checkAnswer);
startButton.addEventListener("click", startGame);
answerInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        checkAnswer();
    }
});

// איפוס המשחק בטעינת הדף
document.addEventListener('DOMContentLoaded', () => {
    quizSection.style.display = "none";
    footer.style.display = "none";
    startButton.style.display = "block";
    submitButton.disabled = true;
    answerInput.disabled = true;
});