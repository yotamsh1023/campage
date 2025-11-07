// Client Portal JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Logout button handler
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('האם אתה בטוח שברצונך להתנתק?')) {
                // In a real application, this would handle the logout logic
                window.location.href = 'index.html';
            }
        });
    }

    // Download PDF button handlers
    const downloadPdfButtons = document.querySelectorAll('.btn-download-pdf');
    downloadPdfButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real application, this would trigger the PDF download
            // For demo purposes, we'll just show a message
            const row = this.closest('tr');
            const month = row.querySelector('td:first-child').textContent;
            alert(`מתחיל הורדה של חשבונית עבור ${month}`);
        });
    });

    // Download all (Zip) button handler
    const downloadAllBtn = document.querySelector('.btn-download-all');
    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real application, this would trigger the ZIP download
            alert('מתחיל הורדה של כל החשבוניות בחבילה אחת');
        });
    }

    // Smooth scroll for any anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});


