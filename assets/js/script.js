/*=============== PRELOADER ===============*/
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1500);
});

/*=============== MENU TOGGLE ===============*/
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    // Toggle nav menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when nav link is clicked
    navLinksItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Active link based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
});

/*=============== SCROLL HEADER ===============*/
function scrollHeader() {
    const header = document.querySelector('header');
    if (window.scrollY >= 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}
window.addEventListener('scroll', scrollHeader);

/*=============== BACK TO TOP BUTTON ===============*/
function scrollTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (window.scrollY >= 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
}
window.addEventListener('scroll', scrollTop);

/*=============== TYPING ANIMATION ===============*/
document.addEventListener('DOMContentLoaded', function() {
    const typedTextElement = document.querySelector('.typed-text');
    
    if (typedTextElement) {
        const typedStrings = ['CSIT Student', 'Web Developer', 'Programmer', 'Tech Enthusiast'];
        let stringIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeDelay = 100;

        function type() {
            const currentString = typedStrings[stringIndex];
            
            if (isDeleting) {
                typedTextElement.textContent = currentString.substring(0, charIndex - 1);
                charIndex--;
                typeDelay = 50;
            } else {
                typedTextElement.textContent = currentString.substring(0, charIndex + 1);
                charIndex++;
                typeDelay = 150;
            }

            if (!isDeleting && charIndex === currentString.length) {
                isDeleting = true;
                typeDelay = 1500; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                stringIndex = (stringIndex + 1) % typedStrings.length;
                typeDelay = 500; // Pause before typing next word
            }

            setTimeout(type, typeDelay);
        }

        setTimeout(type, 1000);
    }
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // About section animations
        gsap.from('.about-image', {
            scrollTrigger: {
                trigger: '.about-content',
                start: 'top 80%',
                end: 'bottom 60%',
                toggleActions: 'play none none none'
            },
            x: -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.about-text', {
            scrollTrigger: {
                trigger: '.about-content',
                start: 'top 80%',
                end: 'bottom 60%',
                toggleActions: 'play none none none'
            },
            x: 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        // Education timeline animation
        gsap.from('.timeline-item', {
            scrollTrigger: {
                trigger: '.timeline',
                start: 'top 80%',
                end: 'bottom 60%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            stagger: 0.3,
            duration: 0.8,
            ease: 'power2.out'
        });

        // Skills animation
        gsap.from('.skill-category', {
            scrollTrigger: {
                trigger: '.skills-content',
                start: 'top 80%',
                end: 'bottom 60%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            stagger: 0.3,
            duration: 0.8
        });

        // Animate skill progress bars
        gsap.utils.toArray('.progress').forEach(progress => {
            const width = progress.style.width;
            
            gsap.fromTo(progress, 
                {width: 0}, 
                {
                    scrollTrigger: {
                        trigger: progress,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    },
                    width: width,
                    duration: 1.5,
                    ease: 'power2.out'
                }
            );
        });

        // Projects animation
        gsap.from('.project-item', {
            scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 80%',
                end: 'bottom 60%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8
        });

        // Contact items animation
        gsap.from('.contact-item', {
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 80%',
                end: 'bottom 60%',
                toggleActions: 'play none none none'
            },
            x: -50,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8
        });

        gsap.from('.contact-form', {
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 80%',
                end: 'bottom 60%',
                toggleActions: 'play none none none'
            },
            x: 50,
            opacity: 0,
            duration: 0.8
        });
    }
});

/*=============== PROJECT FILTER ===============*/
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    gsap.to(item, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.4,
                        ease: 'power2.out',
                        clearProps: 'all'
                    });
                    item.style.display = 'block';
                } else {
                    gsap.to(item, {
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.4,
                        ease: 'power2.out',
                        onComplete: function() {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
});

/*=============== CONTACT FORM ===============*/
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the form data to a server
            // For now, we'll just log it and show a success message
            console.log('Form submitted:', { name, email, subject, message });
            
            // Add a success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = 'Thank you for your message! I will get back to you soon.';
            successMessage.style.padding = '15px';
            successMessage.style.marginTop = '20px';
            successMessage.style.backgroundColor = '#4CAF50';
            successMessage.style.color = 'white';
            successMessage.style.borderRadius = '5px';
            successMessage.style.textAlign = 'center';
            
            contactForm.appendChild(successMessage);
            
            // Reset the form
            contactForm.reset();
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        });
    }
});

/*=============== SMOOTH SCROLLING ===============*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
