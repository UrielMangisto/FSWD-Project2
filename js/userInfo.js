const renderResults = () => {
  console.log("Rendering results...");
  const resultsContainer = document.getElementById("results-container");

  if (!resultsContainer) return;

  resultsContainer.innerHTML = '<h1>Game Results</h1>';

  const gamesData = JSON.parse(localStorage.getItem('gamesData')) || [];

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
      game.players
          .sort((a, b) => b.score - a.score)
          .forEach((player) => {
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

document.addEventListener("DOMContentLoaded", renderResults);

export function updateGameData(playerName, score, gameName) {
  // כבר לא צריך את הפונקציה הזו כי הכל מתעדכן דרך userManager
  console.log(`Score update: ${playerName} scored ${score} in ${gameName}`);
}

export default updateGameData;