/**
 * userInfo.js
 * Displays game results for all users.
 */

/**
 * Renders the game results on the page.
 */
const renderResults = () => {
    const resultsContainer = document.getElementById("results-container"); // Container to display results
    if (!resultsContainer) return;

    // Add a heading to the results container
    resultsContainer.innerHTML = '<h1>Game Results</h1>';

    // Fetch game data from localStorage
    const gamesData = JSON.parse(localStorage.getItem('gamesData')) || [];

    // Iterate through each game's data and create a section for it
    gamesData.forEach((game) => {
        const section = document.createElement("section");
        section.classList.add("game-section"); // Add styling class

        // Create a title for the game
        const title = document.createElement("h1");
        title.textContent = `Game: ${game.gameName}`;
        section.appendChild(title);

        // Create a table to display the players and their scores
        const table = document.createElement("table");
        table.classList.add("results-table"); // Add styling class

        // Create the table header
        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>Player</th>
                <th>Score</th>
            </tr>
        `;
        table.appendChild(thead);

        // Create the table body and fill it with player data
        const tbody = document.createElement("tbody");
        game.players
            .sort((a, b) => b.score - a.score) // Sort players by score in descending order
            .forEach((player) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${player.name}</td>
                    <td>${player.score}</td>
                `;
                tbody.appendChild(row);
            });

        // Append the table body to the table
        table.appendChild(tbody);

        // Add the table to the section
        section.appendChild(table);

        // Add the section to the results container
        resultsContainer.appendChild(section);
    });
};

// Render results once the page is fully loaded
document.addEventListener("DOMContentLoaded", renderResults);
