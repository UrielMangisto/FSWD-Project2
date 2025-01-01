class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = null;
        const gamesData = JSON.parse(localStorage.getItem('gamesData'));
        if (!gamesData) {
            this.initializeGamesData();
        }
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
        
        // הוספת כל המשתמשים הקיימים למשחקים
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

        // Add user to games data
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
        const user = this.users.find(u => 
            u.username === username && u.password === password
        );
 
        if (!user) {
            throw new Error('Invalid username or password');
        }
 
        user.lastLogin = new Date().toISOString();
        this.currentUser = username;
        localStorage.setItem('users', JSON.stringify(this.users));
        
        // Set cookie for 2 hours
        const expires = new Date();
        expires.setHours(expires.getHours() + 2);
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

    getCurrentUserData() {
        const user = this.getCurrentUser();
        if (!user) {
            this.logout();
            return null;
        }
        return user;
    }

    updateUserScore(gameId, score) {
        const user = this.getCurrentUser();
        if (!user) return;
            
        // עדכון במבנה gameData
        const gamesData = JSON.parse(localStorage.getItem('gamesData'));
        const game = gamesData.find(g => g.gameName === gameId);
        
        if (game) {
            const player = game.players.find(p => p.name === user.username);
            if (player && score > player.score) {
                player.score = score;
                localStorage.setItem('gamesData', JSON.stringify(gamesData));
            }
        }
    }
}
 
const userManager = new UserManager();
export default userManager;