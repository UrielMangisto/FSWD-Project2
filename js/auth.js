class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || {};
        this.currentUser = null;
        this.loginAttempts = {};
    }

    // הרשמת משתמש חדש
    async register(username, password, email, fullName) {
        if (this.users[username]) {
            throw new Error('שם משתמש כבר קיים במערכת');
        }

        // בדיקת תקינות הסיסמה
        await this.validatePassword(password);

        const hashedPassword = await this.hashPassword(password);
        
        this.users[username] = {
            password: hashedPassword,
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
    async login(username, password) {
        if (this.isUserBlocked(username)) {
            throw new Error('המשתמש חסום. נסה שוב עוד 30 דקות');
        }

        const user = this.users[username];
        const hashedPassword = await this.hashPassword(password);
        
        if (!user || user.password !== hashedPassword) {
            this.recordLoginAttempt(username);
            throw new Error('שם משתמש או סיסמה שגויים');
        }

        delete this.loginAttempts[username];
        user.lastLogin = new Date().toISOString();
        localStorage.setItem('users', JSON.stringify(this.users));
        this.setLoginCookie(username);
        this.currentUser = username;
        
        return true;
    }

    // בדיקת תקינות סיסמה
    async validatePassword(password) {
        const minLength = 8;
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasSpecial = /[!@#$%^&*]/.test(password);
        
        if (password.length < minLength) {
            throw new Error('הסיסמה חייבת להכיל לפחות 8 תווים');
        }
        if (!hasNumber) {
            throw new Error('הסיסמה חייבת להכיל לפחות מספר אחד');
        }
        if (!hasLetter) {
            throw new Error('הסיסמה חייבת להכיל לפחות אות אחת');
        }
        if (!hasSpecial) {
            throw new Error('הסיסמה חייבת להכיל לפחות תו מיוחד אחד');
        }
    }

    // הצפנת סיסמה
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // [שאר המתודות הקיימות נשארות ללא שינוי]
    logout() {
        this.currentUser = null;
        this.clearLoginCookie();
    }

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

    recordLoginAttempt(username) {
        if (!this.loginAttempts[username]) {
            this.loginAttempts[username] = { count: 0, timestamp: Date.now() };
        }
        this.loginAttempts[username].count++;
        this.loginAttempts[username].timestamp = Date.now();
    }

    setLoginCookie(username) {
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 2);
        document.cookie = `loggedInUser=${username};expires=${expiryDate.toUTCString()};path=/`;
    }

    clearLoginCookie() {
        document.cookie = 'loggedInUser=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }

    updateGameStats(game, score) {
        if (!this.currentUser) return;
        
        const user = this.users[this.currentUser];
        if (score > user.games[game].highScore) {
            user.games[game].highScore = score;
        }
        user.games[game].gamesPlayed++;
        
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    getCurrentUserData() {
        return this.currentUser ? this.users[this.currentUser] : null;
    }
}

const userManager = new UserManager();
export default userManager;
