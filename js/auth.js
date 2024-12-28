// מחלקה לניהול משתמשים
class UserManager {
  constructor() {
      this.users = JSON.parse(localStorage.getItem('users')) || {};
      this.currentUser = null;
      this.loginAttempts = {};
  }

  // הרשמת משתמש חדש
  register(username, password, email, fullName) {
      if (this.users[username]) {
          throw new Error('שם משתמש כבר קיים במערכת');
      }

      this.users[username] = {
          password: this.hashPassword(password),
          email,
          fullName,
          joinDate: new Date().toISOString(),
          games: {
              play1: { highScore: 0, gamesPlayed: 0 },
              play2: { highScore: 0, gamesPlayed: 0 }
          },
          lastLogin: null
      };

      localStorage.setItem('users', JSON.stringify(this.users));
      return true;
  }

  // כניסה למערכת
  login(username, password) {
      // בדיקת ניסיונות כניסה
      if (this.isUserBlocked(username)) {
          throw new Error('המשתמש חסום. נסה שוב עוד 30 דקות');
      }

      const user = this.users[username];
      if (!user || user.password !== this.hashPassword(password)) {
          this.recordLoginAttempt(username);
          throw new Error('שם משתמש או סיסמה שגויים');
      }

      // איפוס ניסיונות כניסה כושלים
      delete this.loginAttempts[username];
      
      // עדכון זמן כניסה אחרון
      user.lastLogin = new Date().toISOString();
      localStorage.setItem('users', JSON.stringify(this.users));
      
      // שמירת עוגיה
      this.setLoginCookie(username);
      
      this.currentUser = username;
      return true;
  }

  // יציאה מהמערכת
  logout() {
      this.currentUser = null;
      this.clearLoginCookie();
  }

  // בדיקת חסימת משתמש
  isUserBlocked(username) {
      const attempts = this.loginAttempts[username];
      if (!attempts) return false;
      
      const { count, timestamp } = attempts;
      const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
      
      if (count >= 3 && timestamp > thirtyMinutesAgo) {
          return true;
      }
      
      if (timestamp < thirtyMinutesAgo) {
          delete this.loginAttempts[username];
      }
      
      return false;
  }

  // רישום ניסיון כניסה כושל
  recordLoginAttempt(username) {
      if (!this.loginAttempts[username]) {
          this.loginAttempts[username] = { count: 0, timestamp: Date.now() };
      }
      this.loginAttempts[username].count++;
      this.loginAttempts[username].timestamp = Date.now();
  }

  // הצפנה בסיסית לסיסמה
  hashPassword(password) {
      return btoa(password); // בסיסי - במציאות נשתמש בהצפנה חזקה יותר
  }

  // שמירת עוגיית התחברות
  setLoginCookie(username) {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 2); // תוקף לשעתיים
      document.cookie = `loggedInUser=${username};expires=${expiryDate.toUTCString()};path=/`;
  }

  // מחיקת עוגיית התחברות
  clearLoginCookie() {
      document.cookie = 'loggedInUser=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
  }

  // עדכון נתוני משחק
  updateGameStats(game, score) {
      if (!this.currentUser) return;
      
      const user = this.users[this.currentUser];
      if (score > user.games[game].highScore) {
          user.games[game].highScore = score;
      }
      user.games[game].gamesPlayed++;
      
      localStorage.setItem('users', JSON.stringify(this.users));
  }

  // קבלת נתוני המשתמש הנוכחי
  getCurrentUserData() {
      return this.currentUser ? this.users[this.currentUser] : null;
  }
}

// יצירת מופע יחיד של מנהל המשתמשים
const userManager = new UserManager();
export default userManager;