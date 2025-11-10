// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Add active class to nav links on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Create overlay element
const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

// Card expansion functionality
document.querySelectorAll('.competency-item').forEach(card => {
    card.addEventListener('click', function(e) {
        // Don't expand if clicking close button
        if (e.target.classList.contains('close-card')) {
            return;
        }
        
        // Remove expanded class from other cards
        document.querySelectorAll('.competency-item.expanded').forEach(expandedCard => {
            if (expandedCard !== this) {
                expandedCard.classList.remove('expanded');
            }
        });

        // Add expanded class and show overlay
        this.classList.add('expanded');
        overlay.classList.add('active');
    });
});

// Close card functionality
document.querySelectorAll('.close-card').forEach(closeBtn => {
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const card = this.closest('.competency-item');
        card.classList.remove('expanded');
        overlay.classList.remove('active');
    });
});

// Close card when clicking overlay
overlay.addEventListener('click', function() {
    document.querySelectorAll('.competency-item.expanded').forEach(card => {
        card.classList.remove('expanded');
    });
    this.classList.remove('active');
});

// Close card on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.competency-item.expanded').forEach(card => {
            card.classList.remove('expanded');
        });
        overlay.classList.remove('active');
    }
});

// Update stored positions on window resize
window.addEventListener('resize', () => {
    document.querySelectorAll('.competency-item').forEach(card => {
        if (!card.classList.contains('expanded')) {
            const rect = card.getBoundingClientRect();
            // Removed cardPositions.set(card, { ... });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    // store original HTML once, so we can rebuild on resize
    if (!track.dataset.originalHtml) track.dataset.originalHtml = track.innerHTML;

    function setup() {
        // restore original set, then duplicate it for a seamless loop
        track.classList.remove('is-animated');
        track.innerHTML = track.dataset.originalHtml;

        const originalWidth = track.getBoundingClientRect().width || 0;
        // duplicate content
        track.innerHTML += track.dataset.originalHtml;

        // set CSS variables used by the animation
        track.style.setProperty('--scroll-width', `${originalWidth}px`);

        // compute duration (px per second). Adjust speed as desired.
        const speed = 50; // pixels per second — slowed to half (was 100)
        let duration = originalWidth / speed;
        if (duration < 8) duration = 8; // minimum duration
        track.style.setProperty('--scroll-duration', `${duration}s`);

        // reflow then start animation
        void track.offsetWidth;
        track.classList.add('is-animated');
    }

    setup();

    // recalc on resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setup, 250);
    });
});
