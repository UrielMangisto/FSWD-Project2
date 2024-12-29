// שליפת הנתונים מ-Local Storage או שימוש בנתונים ברירת מחדל אם אין נתונים
let gamesData = JSON.parse(localStorage.getItem("gamesData")) || [
  {
    gameName: "Racing Game",
    players: [
      { name: "John Doe", score: 1200 },
      { name: "Jane Smith", score: 1500 },
    ],
  },
  {
    gameName: "Math Quiz Master",
    players: [
      { name: "John Doe", score: 30 },
      { name: "Jane Smith", score: 20 },
    ],
  },
];

// פונקציה להצגת התוצאות ב-DOM
const renderResults = () => {
  console.log("Rendering results...");
  const resultsContainer = document.getElementById("results-container");

  if (!resultsContainer) {
    //console.error("Element with ID 'results-container' not found.");
    return;
  }

  // איפוס התוכן הקיים
  resultsContainer.innerHTML = '<h1>Game Results</h1>';

  gamesData.forEach((game) => {
    const section = document.createElement("section");
    section.classList.add("game-section");

    const title = document.createElement("h1");
    title.textContent = `Game: ${game.gameName}`;
    section.appendChild(title);

    const table = document.createElement("table");
    table.classList.add("results-table");

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Player</th>
        <th>Score</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    game.players.forEach((player) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${player.name}</td>
        <td>${player.score}</td>
      `;
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    section.appendChild(table);

    resultsContainer.appendChild(section);
  });
};


// עדכון מערך הנתונים
const updateGameData = (playerName, newScore, gamename) => {
  
  const game = gamesData.find((g) => g.gameName === gamename);

  if (game) {
    // בדוק אם השחקן כבר קיים
    const player = game.players.find((p) => p.name === playerName);

    if (player) {
      // עדכון ניקוד השחקן אם הוא קיים
      if (newScore > player.score) {
        player.score = newScore;
      }
    } else {
      // הוספת שחקן חדש אם לא קיים
      game.players.push({ name: playerName, score: newScore });
    }
  } else {
    console.error("Game not found in gamesData.");
  }

  // שמירת מבנה הנתונים המעודכן ב-Local Storage
  localStorage.setItem("gamesData", JSON.stringify(gamesData));
};

export default updateGameData;

// קריאה לפונקציה בעת טעינת הדף
// document.addEventListener("DOMContentLoaded", renderResults);

document.addEventListener("DOMContentLoaded", () => {
  // כאשר המשתמש נכנס לעמוד הטבלה, התצוגה מתעדכנת
  renderResults();
});
