/**
 * auth.js
 * מודול ניהול משתמשים והרשאות במערכת
 */

class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = null;
        this.loginAttempts = JSON.parse(localStorage.getItem('loginAttempts')) || {};
        
        // בדיקת נתוני משחקים
        const gamesData = JSON.parse(localStorage.getItem('gamesData'));
        if (!gamesData) {
            this.initializeGamesData();
        }
    
        // בדיקה תקופתית של תוקף הקוקי
        setInterval(() => {
            if (this.currentUser && !this.checkCookieValid()) {
                this.logout();
                alert('Session expired. Please login again.');
                window.location.href = 'html/login.html';
            }
        }, 30000);
    }

    // פונקציה חדשה לבדיקת תוקף הקוקי
    checkCookieValid() {
        return document.cookie
            .split('; ')
            .some(row => row.startsWith('loggedInUser='));
    }


    initializeGamesData() {
        const gamesData = [
            {
                gameName: "Racing Game",
                players: []
            },
            {
                gameName: "Math Quiz Master",
                players: []
            }
        ];
        
        this.users.forEach(user => {
            gamesData.forEach(game => {
                game.players.push({
                    name: user.username,
                    score: 0
                });
            });
        });
        
        localStorage.setItem('gamesData', JSON.stringify(gamesData));
    }

    register(username, password, email, fullName) {
        if (this.users.find(u => u.username === username)) {
            throw new Error('Username already exists');
        }
 
        const newUser = {
            username,
            password,
            email,
            fullName,
            joinDate: new Date().toISOString(),
            lastLogin: null
        };

        // הוספת המשתמש לנתוני המשחקים
        const gamesData = JSON.parse(localStorage.getItem('gamesData'));
        gamesData.forEach(game => {
            game.players.push({
                name: username,
                score: 0
            });
        });
        localStorage.setItem('gamesData', JSON.stringify(gamesData));

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        return true;
    }
 
    login(username, password) {
        // בדיקת ניסיונות כושלים
        const attempts = this.loginAttempts[username] || { count: 0, timestamp: null };
        const now = Date.now();
        
        // בדיקת חסימה (3 ניסיונות, חסימה ל-30 דקות)
        if (attempts.count >= 3 && now - attempts.timestamp < 30 * 60 * 1000) {
            const minutesLeft = Math.ceil((30 * 60 * 1000 - (now - attempts.timestamp)) / 60000);
            throw new Error(`החשבון נחסם. נסה שוב בעוד ${minutesLeft} דקות`);
        }

        const user = this.users.find(u => 
            u.username === username && u.password === password
        );
 
        if (!user) {
            // עדכון ניסיונות כושלים
            attempts.count = (attempts.count || 0) + 1;
            attempts.timestamp = now;
            this.loginAttempts[username] = attempts;
            localStorage.setItem('loginAttempts', JSON.stringify(this.loginAttempts));
            
            const remainingAttempts = 3 - attempts.count;
            throw new Error(`שם משתמש או סיסמה שגויים. נותרו ${remainingAttempts} נסיונות`);
        }

        // איפוס ניסיונות כושלים אחרי התחברות מוצלחת
        delete this.loginAttempts[username];
        localStorage.setItem('loginAttempts', JSON.stringify(this.loginAttempts));
 
        user.lastLogin = new Date().toISOString();
        this.currentUser = username;
        localStorage.setItem('users', JSON.stringify(this.users));
        
        // הגדרת cookie עם תפוגה של שעתיים
        const expires = new Date();
        expires.setHours(expires.getHours() + 2);
        //expires.setMinutes(expires.getMinutes() + 2);  // ניסיון לבדיקת תקפות הקוקי
        document.cookie = `loggedInUser=${username};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
        
        return true;
    }
 
    logout() {
        this.currentUser = null;
        document.cookie = 'loggedInUser=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
 
    getCurrentUser() {
        if (!this.currentUser) {
            const cookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('loggedInUser='));
                
            if (cookie) {
                this.currentUser = cookie.split('=')[1];
            }
        }
        return this.currentUser ? this.users.find(u => u.username === this.currentUser) : null;
    }

    updateUserScore(gameName, score) {
        const user = this.getCurrentUser();
        if (!user) return false;
            
        const gamesData = JSON.parse(localStorage.getItem('gamesData'));
        const game = gamesData.find(g => g.gameName === gameName);
        
        if (game) {
            const player = game.players.find(p => p.name === user.username);
            if (player && score > player.score) {
                player.score = score;
                localStorage.setItem('gamesData', JSON.stringify(gamesData));
                return true;
            }
        }
        return false;
    }
}
 
const userManager = new UserManager();
export default userManager;