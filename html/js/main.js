document.addEventListener("DOMContentLoaded", () => {
    const gamesContainer = document.getElementById("games");
  
    // Load games dynamically
    gamesData.forEach((game) => {
      const gameCard = document.createElement("div");
      gameCard.classList.add("game-card");
  
      gameCard.innerHTML = `
        <img src="${game.image}" alt="${game.name}">
        <h3>${game.name}</h3>
        <span class="badge ${game.status}">${game.status}</span>
      `;
  
      gamesContainer.appendChild(gameCard);
    });
  
    // Handle search
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", (e) => {
      const searchValue = e.target.value.toLowerCase();
      const filteredGames = gamesData.filter((game) =>
        game.name.toLowerCase().includes(searchValue)
      );
  
      gamesContainer.innerHTML = "";
      filteredGames.forEach((game) => {
        const gameCard = document.createElement("div");
        gameCard.classList.add("game-card");
  
        gameCard.innerHTML = `
          <img src="${game.image}" alt="${game.name}">
          <h3>${game.name}</h3>
          <span class="badge ${game.status}">${game.status}</span>
        `;
  
        gamesContainer.appendChild(gameCard);
      });
    });
  });
  