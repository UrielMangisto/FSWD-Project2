export async function loadSidebar() {
    try {
        const response = await fetch('../html/sidebar.html');
        const html = await response.text();
        
        // מחפש את ה-div עם ה-id="app"
        const appContainer = document.getElementById('app');
        if (!appContainer) {
            throw new Error('Container element not found');
        }

        // מוסיף את הסיידבר בתחילת ה-app container
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        appContainer.insertBefore(tempDiv.firstChild, appContainer.firstChild);

        // מעדכן את הנתיב לתמונת הלוגו בהתאם לדף הנוכחי
        const currentPath = window.location.pathname;
        const logoImg = document.querySelector('.sidebar .logo img');
        if (logoImg) {
            if (currentPath.includes('/html/')) {
                logoImg.src = '../images/Logo.webp';
            } else {
                logoImg.src = 'images/Logo.webp';
            }
        }

        // מעדכן את כל הקישורים בהתאם למיקום הנוכחי
        const links = document.querySelectorAll('.sidebar a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('../') && !currentPath.includes('/html/')) {
                link.href = href.replace('../', '');
            }
        });

        // מראה את קישור הפרופיל רק למשתמשים מחוברים
        const profileLink = document.getElementById('profileLink');
        if (profileLink) {
            const isLoggedIn = document.cookie.includes('loggedInUser=');
            profileLink.style.display = isLoggedIn ? 'block' : 'none';
        }

        // מוסיף קלאס active לקישור הנוכחי
        const currentPage = currentPath.split('/').pop();
        const currentCategory = new URLSearchParams(window.location.search).get('filter');
        
        links.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            const linkCategory = new URLSearchParams(link.search).get('filter');
            
            if (linkPath === currentPage || linkCategory === currentCategory) {
                link.parentElement.classList.add('active');
            }
        });

    } catch (error) {
        console.error('Error loading sidebar:', error);
    }
}