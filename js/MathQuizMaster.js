import updateGameData from './userInfo.js';

// הגדרות בסיסיות של המשחק
let score = 0; // ניקוד התחלתי
let timeLeft = 30; // זמן למשחק (בשניות)
let currentQuestion = {}; // שאלה נוכחית
let timer; // מזהה הטיימר

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

// פונקציה ליצירת שאלה רנדומלית
const generateQuestion = () => {
  const num1 = Math.floor(Math.random() * 10) + 1; // מספר ראשון
  const num2 = Math.floor(Math.random() * 10) + 1; // מספר שני
  const operators = ["+", "-", "*"];
  const operator = operators[Math.floor(Math.random() * operators.length)]; // אופרטור רנדומלי
  let answer;

  // חישוב התשובה
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

  // עדכון השאלה הנוכחית
  currentQuestion = { num1, num2, operator, answer };

  // הצגת השאלה
  questionElement.textContent = `What is ${num1} ${operator} ${num2}?`;
};

// פונקציה לבדוק תשובה
const checkAnswer = () => {
  const userAnswer = parseInt(answerInput.value, 10);

  // אם התשובה נכונה
  if (userAnswer === currentQuestion.answer) {
    score += 10; // תוספת ניקוד
    feedbackElement.textContent = "Correct! 🎉";
    feedbackElement.style.color = "green";
  } else {
    feedbackElement.textContent = "Wrong! 😔";
    feedbackElement.style.color = "red";
  }

  // עדכון הניקוד
  scoreElement.textContent = score;

  // איפוס התשובה והפקת שאלה חדשה
  answerInput.value = "";
  generateQuestion();
};

// פונקציה להתחלת המשחק
let playerName = ""; // שם השחקן

const startGame = () => {
  // בקשת שם השחקן
  playerName = prompt("Enter your name:");

  if (!playerName) {
    alert("Name is required to play!");
    return;
  }

  // איפוס ערכים
  score = 0;
  timeLeft = 30;
  scoreElement.textContent = score;
  timeElement.textContent = timeLeft;
  feedbackElement.textContent = "";

  // הצגת אזורי המשחק
  quizSection.style.display = "block";
  footer.style.display = "block";
  startButton.style.display = "none";

  // יצירת השאלה הראשונה
  generateQuestion();

  // התחלת הטיימר
  timer = setInterval(() => {
    timeLeft -= 1;
    timeElement.textContent = timeLeft;

    // אם הזמן נגמר
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
};


// פונקציה לסיום המשחק
const endGame = () => {
    questionElement.textContent = "Game Over! 🎮";
    feedbackElement.textContent = `Your final score: ${score}`;
    feedbackElement.style.color = "blue";
  
    // עדכון תוצאות השחקן במערך הנתונים
    updateGameData(playerName, score);
  
    // שמירת הנתונים המעודכנים ב-Local Storage
    localStorage.setItem("gamesData", JSON.stringify(gamesData));

    // כיבוי כפתור שליחה
    submitButton.disabled = true;
    answerInput.disabled = true;

    console.log(playerName +" "+ score);
  };
  

// אירועים
submitButton.addEventListener("click", checkAnswer);
startButton.addEventListener("click", startGame);
