export async function loadSidebar() {
    try {
        console.log("מתחיל תהליך טעינת הסיידבר");
        const response = await fetch('../html/sidebar.html');
        console.log("תגובת הפצ':", response.status);
        
        if (!response.ok) {
            throw new Error(`נכשלה טעינת הסיידבר עם סטטוס: ${response.status}`);
        }

        const html = await response.text();
        console.log("התקבל HTML של הסיידבר");
        
        const appContainer = document.getElementById('app');
        console.log("האם נמצא מכיל app:", !!appContainer);
        
        if (!appContainer) {
            throw new Error('לא נמצא אלמנט המכיל עם id="app"');
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        appContainer.insertBefore(tempDiv.firstChild, appContainer.firstChild);
        console.log("הסיידבר הוכנס למסמך");

    } catch (error) {
        console.error('שגיאה בטעינת הסיידבר:', error);
        throw error;
    }
}