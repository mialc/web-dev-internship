const glow = document.getElementById('cursorGlow');

document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

// Theme toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    const b = document.body;
    b.dataset.theme === 'dark' ? b.removeAttribute('data-theme') : b.setAttribute('data-theme', 'dark');
});

// Section scroll buttons
document.querySelectorAll('.scroll-btn[data-scroll-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.getElementById(btn.dataset.scrollTarget).scrollIntoView({ behavior: 'smooth' });
    });
});

// Hero cursor-reactive grid reveal
const hero = document.getElementById('hero');
hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
    hero.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
});

// Contact form -> opens a pre-filled email to miacarrillobusiness@gmail.com
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:miacarrillobusiness@gmail.com?subject=${subject}&body=${body}`;
    contactStatus.textContent = 'Opening your email client…';
});

// Active nav-link highlighting on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#navbarNav .nav-link');
const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            navLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach((s) => navObserver.observe(s));

// Scroll-reveal for skill and project cards
const revealEls = document.querySelectorAll('.skills .card, .project-card');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
revealEls.forEach((el) => revealObserver.observe(el));

// Footer year
document.getElementById('footer-year').textContent = new Date().getFullYear();
