// נתוני המשחקים
const gamesData = [
  {
    gameName: "Puzzle Master",
    players: [
      { name: "John Doe", score: 1200, timePlayed: "5 min" },
      { name: "Jane Smith", score: 1500, timePlayed: "4 min" },
      { name: "Player 3", score: 800, timePlayed: "7 min" },
    ],
  },
  {
    gameName: "Math Quiz Master",
    players: [
      { name: "John Doe", score: 3000},
      { name: "Jane Smith", score: 2500},
      { name: "Player 3", score: 1000},
    ],
  },
];

// פונקציה להצגת התוצאות ב-DOM
const renderResults = () => {
  console.log("Rendering results..."); // בדיקת קריאה לפונקציה
  const resultsContainer = document.getElementById("results-container");

  if (!resultsContainer) {
    console.error("Element with ID 'results-container' not found.");
    return;
  }

  gamesData.forEach((game) => {
    // יצירת אזור חדש למשחק
    const section = document.createElement("section");
    section.classList.add("game-section");

    // הוספת שם המשחק
    const title = document.createElement("h2");
    title.textContent = `Game: ${game.gameName}`;
    section.appendChild(title);

    // יצירת טבלה
    const table = document.createElement("table");
    table.classList.add("results-table");

    // הוספת כותרת לטבלה
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Player</th>
        <th>Score</th>
        <th>Time Played</th>
      </tr>
    `;
    table.appendChild(thead);

    // הוספת שחקנים לטבלה
    const tbody = document.createElement("tbody");
    game.players.forEach((player) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${player.name}</td>
        <td>${player.score}</td>
        <td>${player.timePlayed}</td>
      `;
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    section.appendChild(table);

    // הוספת האזור למיכל הראשי
    resultsContainer.appendChild(section);
  });
};

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


// קריאה לפונקציה בעת טעינת הדף
document.addEventListener("DOMContentLoaded", renderResults);
