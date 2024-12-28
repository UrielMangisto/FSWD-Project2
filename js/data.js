// נתוני המשחקים באתר
export const gamesData = {
  play1: {
      id: 'play1',
      title: 'משחק תנועה',
      description: 'משחק אקשן מהיר עם אנימציות',
      thumbnail: '../images/Logo1.webp',
      status: 'active',
      difficulty: {
          easy: { speed: 1, obstacles: 3 },
          medium: { speed: 1.5, obstacles: 5 },
          hard: { speed: 2, obstacles: 7 }
      }
  },
  play2: {
      id: 'play2',
      title: 'משחק לוגיקה',
      description: 'משחק חשיבה מאתגר',
      thumbnail: '../images/Logo2.webp',
      status: 'active',
      difficulty: {
          easy: { time: 180, hints: 3 },
          medium: { time: 120, hints: 2 },
          hard: { time: 60, hints: 1 }
      }
  },
  comingSoon1: {
      id: 'comingSoon1',
      title: 'בקרוב - משחק קלפים',
      description: 'משחק קלפים חדש',
      thumbnail: '../images/Logo3.webp',
      status: 'comingSoon'
  },
  comingSoon2: {
      id: 'comingSoon2',
      title: 'בקרוב - משחק אסטרטגיה',
      description: 'משחק אסטרטגיה מורכב',
      thumbnail: '../images/Logo4.webp',
      status: 'comingSoon'
  }
};

// דירוג המשחקים
export const getTopScores = (gameId) => {
  const users = JSON.parse(localStorage.getItem('users')) || {};
  const scores = Object.entries(users)
      .map(([username, data]) => ({
          username,
          score: data.games[gameId]?.highScore || 0,
          gamesPlayed: data.games[gameId]?.gamesPlayed || 0
      }))
      .filter(user => user.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  
  return scores;
};