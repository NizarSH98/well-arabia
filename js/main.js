/* ═══════════════════════════════════════════════════════════════
   WELL ARABIA — SHARED JAVASCRIPT
   Navigation, animations, micro-interactions
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // ——— Page Loader ———
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => loader.classList.add('done'), 800);
        });
        // Fallback
        setTimeout(() => loader.classList.add('done'), 3000);
    }

    // ——— Nav Dropdown (Solutions) ———
    const navDropdown = document.querySelector('.nav__dropdown');
    const dropdownToggle = document.querySelector('.nav__dropdown-toggle');
    if (dropdownToggle && navDropdown) {
        // Toggle on click for touch devices
        dropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navDropdown.classList.toggle('open');
        });
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!navDropdown.contains(e.target)) {
                navDropdown.classList.remove('open');
            }
        });
        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') navDropdown.classList.remove('open');
        });
    }

    // ——— Cursor Glow ———
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        let mx = 0, my = 0, cx = 0, cy = 0;
        let speed = 0;
        document.addEventListener('mousemove', e => {
            const dx = e.clientX - mx;
            const dy = e.clientY - my;
            speed = Math.min(Math.sqrt(dx * dx + dy * dy), 100);
            mx = e.clientX;
            my = e.clientY;
        });
        (function glowLoop() {
            cx += (mx - cx) * 0.06;
            cy += (my - cy) * 0.06;
            const s = 1 + speed * 0.003;
            cursorGlow.style.left = cx + 'px';
            cursorGlow.style.top = cy + 'px';
            cursorGlow.style.transform = `translate(-50%, -50%) scale(${s})`;
            speed *= 0.92;
            requestAnimationFrame(glowLoop);
        })();
    }

    // ——— Scroll: progress bar, nav, back-to-top ———
    const scrollBar = document.getElementById('scrollBar');
    const nav = document.getElementById('nav');
    const toTop = document.getElementById('toTop');
    const bottomNav = document.getElementById('bottomNav');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docH > 0 ? (scrollY / docH) * 100 : 0;

        if (scrollBar) scrollBar.style.width = pct + '%';
        if (nav) nav.classList.toggle('scrolled', scrollY > 60);
        if (toTop) toTop.classList.toggle('visible', scrollY > 500);

        // Bottom nav: hide on scroll down, show on scroll up
        if (bottomNav) {
            if (scrollY > lastScrollY && scrollY > 200) {
                bottomNav.classList.add('hidden');
            } else {
                bottomNav.classList.remove('hidden');
            }
        }
        lastScrollY = scrollY;
    });

    // ——— Back to top ———
    if (toTop) {
        toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ——— Reveal on scroll (IntersectionObserver) ———
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale').forEach(el => revealObs.observe(el));

    // ——— Counter animation ———
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target;
                const target = parseInt(el.dataset.count);
                if (target) animateNum(el, 0, target, 1200);
                counterObs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

    function animateNum(el, start, end, dur) {
        const t0 = performance.now();
        function tick(now) {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(start + (end - start) * eased);
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    // ——— Hero parallax (only on home page) ———
    const heroContent = document.querySelector('.hero__content');
    const heroBlobs = document.querySelectorAll('.hero__blob');
    if (heroContent) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                heroContent.style.transform = 'translateY(' + (y * 0.12) + 'px)';
                heroContent.style.opacity = 1 - (y / window.innerHeight) * 0.5;
                heroBlobs.forEach((b, i) => {
                    b.style.transform = 'translateY(' + (y * (0.04 + i * 0.02)) + 'px)';
                });
            }
        });
    }

    // ——— Mobile menu ———
    const hamburger = document.getElementById('hamburger');
    const mobMenu = document.getElementById('mobMenu');
    const closeMenu = document.getElementById('closeMenu');

    if (hamburger && mobMenu) {
        hamburger.addEventListener('click', () => {
            mobMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', closeMobile);
    }

    // Make closeMobile globally accessible for inline onclick
    window.closeMobile = function() {
        if (mobMenu) {
            mobMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    // ——— Smooth scroll for same-page anchors ———
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const t = document.querySelector(href);
            if (t) {
                e.preventDefault();
                t.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ——— Contact form validation ———
    const contactBtn = document.querySelector('.contact__form .btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const inputs = document.querySelectorAll('.contact__form input, .contact__form textarea, .contact__form select');
            let ok = true;

            inputs.forEach(i => i.classList.remove('form-error', 'form-success'));

            inputs.forEach(i => {
                if (!i.value.trim()) {
                    ok = false;
                    i.classList.add('form-error');
                    i.addEventListener('focus', function h() { this.classList.remove('form-error'); this.removeEventListener('focus', h); });
                }
            });

            const email = document.querySelector('.contact__form input[type="email"]');
            if (email && email.value && !email.value.includes('@')) {
                ok = false;
                email.classList.add('form-error');
            }

            if (ok) {
                inputs.forEach(i => i.classList.add('form-success'));
                this.innerHTML = 'Message Sent <i class="fas fa-check"></i>';
                this.classList.add('btn--sent');
                setTimeout(() => {
                    inputs.forEach(i => { i.value = ''; i.classList.remove('form-success'); });
                    this.innerHTML = 'Send Message <i class="fas fa-paper-plane" style="font-size:0.7rem"></i>';
                    this.classList.remove('btn--sent');
                }, 3000);
            }
        });
    }

    // ——— Newsletter ———
    const nlSubmit = document.querySelector('.newsletter__submit');
    const nlInput = document.querySelector('.newsletter__input');

    if (nlSubmit && nlInput) {
        nlSubmit.addEventListener('click', function() {
            if (nlInput.value.includes('@')) {
                this.textContent = 'Subscribed!';
                this.style.background = 'var(--cedar-deep)';
                nlInput.value = '';
                nlInput.classList.add('form-success');
                setTimeout(() => {
                    this.textContent = 'Subscribe';
                    this.style.background = '';
                    nlInput.classList.remove('form-success');
                }, 3000);
            } else if (nlInput.value.length > 0) {
                nlInput.classList.add('form-error');
                nlInput.addEventListener('focus', function h() { this.classList.remove('form-error'); this.removeEventListener('focus', h); });
            }
        });

        nlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') nlSubmit.click();
        });
    }

    // ——— Magnetic Button Effect ———
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const dx = (e.clientX - rect.left - rect.width / 2) * 0.3;
            const dy = (e.clientY - rect.top - rect.height / 2) * 0.3;
            this.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // ——— Card Tilt Micro-interaction ———
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            this.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px) scale(1.01)`;
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // ——— Stagger children index assignment ———
    document.querySelectorAll('.stagger-children').forEach(parent => {
        parent.querySelectorAll('.reveal').forEach((child, i) => {
            child.style.setProperty('--i', i);
        });
    });
});
