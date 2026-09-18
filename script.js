/* ==========================================================================
   HILLTOP ESTATES REHABILITATION CENTER - JAVASCRIPT CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileDrawer();
    initScrollSpy();
    initDefaultDate();
    initThemeToggle();
});

/* --------------------------------------------------------------------------
   1. STICKY HEADER & SCROLL SPY
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   2. MOBILE DRAWER NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', openMobileDrawer);
    }
}

function openMobileDrawer() {
    document.getElementById('mobile-drawer').classList.add('open');
    document.getElementById('drawer-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileDrawer() {
    document.getElementById('mobile-drawer').classList.remove('open');
    document.getElementById('drawer-overlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

/* --------------------------------------------------------------------------
   3. PHOTO GALLERY FILTERING & LIGHTBOX
   -------------------------------------------------------------------------- */
function filterGallery(category, btnElement) {
    // Update Active Tab Button
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    // Filter Items
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function openLightbox(imageSrc, captionText) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');

    img.src = imageSrc;
    img.alt = captionText;
    caption.textContent = captionText;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

/* --------------------------------------------------------------------------
   4. INTERACTIVE TOUR MODAL
   -------------------------------------------------------------------------- */
function openTourModal(careType) {
    const modal = document.getElementById('tour-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (careType) {
        const select = document.getElementById('tour-type');
        if (select) {
            // Find option matching careType or preselect default
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].text.includes(careType)) {
                    select.selectedIndex = i;
                    break;
                }
            }
        }
    }
}

function closeTourModal() {
    const modal = document.getElementById('tour-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function initDefaultDate() {
    const dateInput = document.getElementById('tour-date');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
}

function handleTourSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('tour-name').value;
    const date = document.getElementById('tour-date').value;

    alert(`Thank you, ${name}! Your tour request for ${date} has been received. Our admissions coordinator will contact you shortly to confirm.`);
    closeTourModal();
    event.target.reset();
}

function handleFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('contact-name').value;
    alert(`Thank you, ${name}! Your message has been sent to Hilltop Estates Rehabilitation Center. We will respond within 24 hours.`);
    event.target.reset();
}

/* --------------------------------------------------------------------------
   5. FAQ ACCORDION TOGGLE
   -------------------------------------------------------------------------- */
function toggleFaq(btnElement) {
    const item = btnElement.parentElement;
    const isActive = item.classList.contains('active');

    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('active'));

    // Toggle current
    if (!isActive) {
        item.classList.add('active');
    }
}

/* --------------------------------------------------------------------------
   6. LIGHT & DARK MODE THEME SWITCHER
   -------------------------------------------------------------------------- */
function initThemeToggle() {
    const desktopBtn = document.getElementById('theme-toggle-btn');
    const mobileBtn = document.getElementById('mobile-theme-toggle-btn');

    // Get current saved theme from localStorage or fallback to system preference
    const savedTheme = localStorage.getItem('hilltop-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('hilltop-theme', theme);

        const iconClass = theme === 'dark' ? 'fa-sun' : 'fa-moon';
        const ariaLabelText = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';

        [desktopBtn, mobileBtn].forEach(btn => {
            if (btn) {
                btn.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
                btn.setAttribute('aria-label', ariaLabelText);
                btn.setAttribute('title', ariaLabelText);
            }
        });
    }

    // Apply active theme immediately on load
    applyTheme(currentTheme);

    // Toggle handler
    function handleToggle() {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    }

    if (desktopBtn) desktopBtn.addEventListener('click', handleToggle);
    if (mobileBtn) mobileBtn.addEventListener('click', handleToggle);

    // Listen for OS system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('hilltop-theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}
