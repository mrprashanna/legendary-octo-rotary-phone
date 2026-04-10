document.addEventListener('DOMContentLoaded', () => {

    // ===== CHECK FOR REDUCED MOTION & TOUCH =====
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // ===== CINEMATIC ENTRANCE ANIMATION =====
    if (!prefersReducedMotion) {
        const tl = anime.timeline({
            easing: 'cubicBezier(0.2, 0.8, 0.2, 1)',
            duration: 1500
        });

        tl.add({
            targets: '.hud-container',
            scale: [0.95, 1],
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1800
        })
        .add({
            targets: '.profile-frame',
            scale: [0, 1],
            opacity: [0, 1],
            offset: '-=1400',
            easing: 'spring(1, 80, 10, 0)'
        })
        .add({
            targets: '.misfit-text',
            opacity: [0, 1],
            rotate: [-15, -5],
            offset: '-=1200'
        })
        .add({
            targets: '.glitch-name',
            opacity: [0, 1],
            translateX: [-20, 0],
            offset: '-=1000'
        })
        .add({
            targets: '.role-badge',
            opacity: [0, 1],
            offset: '-=800'
        })
        .add({
            targets: '.stat-item',
            translateX: [20, 0],
            opacity: [0, 1],
            delay: anime.stagger(150),
            offset: '-=800'
        });
    } else {
        // Fallback: instant visible state
        document.querySelector('.hud-container').style.opacity = '1';
        document.querySelector('.hud-container').style.transform = 'none';
    }

    // ===== 3D TILT EFFECT (Desktop Only) =====
    if (!prefersReducedMotion && !isTouchDevice) {
        const container = document.querySelector('body');
        const hud = document.querySelector('.hud-container');
        let tiltRAF = null;

        function throttle(fn, delay) {
            let last = 0;
            return function(...args) {
                const now = Date.now();
                if (now - last >= delay) {
                    last = now;
                    fn.apply(this, args);
                }
            };
        }

        function handleTilt(e) {
            if (tiltRAF) return;
            tiltRAF = requestAnimationFrame(() => {
                const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
                const yAxis = (window.innerHeight / 2 - e.pageY) / 40;
                hud.style.transition = 'transform 0.1s ease-out';
                hud.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
                tiltRAF = null;
            });
        }

        function resetTilt() {
            hud.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
            hud.style.transform = 'rotateY(0deg) rotateX(0deg)';
        }

        container.addEventListener('mousemove', throttle(handleTilt, 16));
        container.addEventListener('mouseleave', resetTilt);
    }

    // ===== PARTICLE SYSTEM (Lightweight) =====
    if (!prefersReducedMotion) {
        const particlesContainer = document.getElementById('particles');
        const particleCount = window.innerWidth < 800 ? 15 : 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 8}s`;
            particle.style.animationDuration = `${6 + Math.random() * 4}s`;
            particlesContainer.appendChild(particle);
        }
    }

    // ===== PAUSE ANIMATIONS WHEN TAB INACTIVE (Battery Saver) =====
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !prefersReducedMotion) {
            anime.remove('.hud-container, .profile-frame, .scan-line, .particle');
        }
    });

    // ===== KEYBOARD NAVIGATION ENHANCEMENTS =====
    document.querySelectorAll('.stat-item').forEach(link => {
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });
    });

    // ===== CONSOLE EASTER EGG =====
    console.log('%c⚡ Level 99 Dev Portfolio Loaded', 'color:#6c5ce7;font-size:14px;font-weight:bold;');
    console.log('%c🎮 Psst... Want to collaborate? hello@prashannashrestha.com.np', 'color:#fdcb6e;font-size:12px;');
});
