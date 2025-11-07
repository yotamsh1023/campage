const SUPABASE_PROJECT_URL = 'https://ticvfvasxokumficxzal.supabase.co';
const SUPABASE_CALLBACK_PROD = 'https://campagent.vercel.app/auth/callback';
const SUPABASE_CALLBACK_LOCAL = 'http://localhost:3000/auth/callback';

// Facebook OAuth handler
async function initFacebookAuth() {
    const facebookAuthBtn = document.getElementById('facebookAuthBtn');
    const authMessage = document.getElementById('authMessage');
    
    if (facebookAuthBtn) {
        facebookAuthBtn.addEventListener('click', function() {
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const redirectUrl = isLocalhost ? SUPABASE_CALLBACK_LOCAL : SUPABASE_CALLBACK_PROD;
            const supabaseAuthUrl = `${SUPABASE_PROJECT_URL}/auth/v1/authorize?provider=facebook&redirect_to=${encodeURIComponent(redirectUrl)}`;
            window.location.href = supabaseAuthUrl;
        });
    }
    
    // Check for success/error messages stored by the callback handler
    const storedStatus = sessionStorage.getItem('campagentAuthStatus');
    if (storedStatus) {
        try {
            const { status, message } = JSON.parse(storedStatus);
            if (status && message) {
                showMessage(message, status);
            }
        } catch (error) {
            console.error('Failed to parse stored auth status', error);
        } finally {
            sessionStorage.removeItem('campagentAuthStatus');
        }
    }
    
    // Check for success/error messages in URL parameters (legacy flow)
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

