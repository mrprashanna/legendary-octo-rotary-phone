document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Cinematic Entrance ---
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

    // --- Refined 3D Tilt Effect ---
    const container = document.querySelector('body');
    const hud = document.querySelector('.hud-container');

    container.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 40;

        // Slight lag for "weight"
        hud.style.transition = 'transform 0.1s ease-out';
        hud.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    container.addEventListener('mouseleave', () => {
        hud.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        hud.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });
});
