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
    gameName: "Shooter Arena",
    players: [
      { name: "John Doe", score: 3000, timePlayed: "10 min" },
      { name: "Jane Smith", score: 2500, timePlayed: "12 min" },
      { name: "Player 3", score: 1000, timePlayed: "15 min" },
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

// קריאה לפונקציה בעת טעינת הדף
document.addEventListener("DOMContentLoaded", renderResults);
