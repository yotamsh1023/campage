// API base URL - adjust this to match your server
const API_BASE_URL = 'http://localhost:3001';

// Facebook OAuth handler
async function initFacebookAuth() {
    const facebookAuthBtn = document.getElementById('facebookAuthBtn');
    const authMessage = document.getElementById('authMessage');
    
    if (facebookAuthBtn) {
        facebookAuthBtn.addEventListener('click', async function() {
            try {
                // Get OAuth URL from backend
                const response = await fetch(`${API_BASE_URL}/api/auth/facebook?userId=user_${Date.now()}`);
                const data = await response.json();
                
                if (data.authUrl) {
                    // Redirect to Facebook OAuth
                    window.location.href = data.authUrl;
                } else {
                    showMessage('חיבור לפייסבוק נכשל. נסה שוב.', 'error');
                }
            } catch (error) {
                console.error('Facebook auth error:', error);
                showMessage('חיבור לפייסבוק נכשל. נסה שוב.', 'error');
            }
        });
    }
    
    // Check for success/error messages in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const message = urlParams.get('message');
    
    if (success === 'true' && message) {
        showMessage(decodeURIComponent(message), 'success');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error && message) {
        showMessage(decodeURIComponent(message), 'error');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Show message function
function showMessage(text, type) {
    const authMessage = document.getElementById('authMessage');
    if (authMessage) {
        authMessage.textContent = text;
        authMessage.className = `auth-message auth-message-${type}`;
        authMessage.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            authMessage.style.display = 'none';
        }, 5000);
    }
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Facebook OAuth
    initFacebookAuth();
    
    // Handle smooth scroll for "גלה איך זה עובד" button
    const scrollButton = document.querySelector('a[href="#features"]');
    if (scrollButton) {
        scrollButton.addEventListener('click', function(e) {
            e.preventDefault();
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
                featuresSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Add scroll animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and benefit cards for animation
    const animatedElements = document.querySelectorAll('.feature-card, .benefit-card, .demo-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

