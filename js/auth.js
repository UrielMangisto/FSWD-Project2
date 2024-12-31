class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = null;
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
        document.cookie = `loggedInUser=${username};expires=${expires.toUTCString()};path=/`;
        
        return true;
    }
 
    logout() {
        this.currentUser = null;
        document.cookie = 'loggedInUser=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
 
    getCurrentUser() {
        if (!this.currentUser) return null;
        return this.users.find(u => u.username === this.currentUser);
    }
 }
 
 const userManager = new UserManager();
 export default userManager;