document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});


window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(10, 14, 39, 0.95)';
    } else {
        nav.style.background = 'rgba(10, 14, 39, 0.9)';
    }
});


let currentService = 1;

function changeService(index) {
    currentService = index;
    const cards = document.querySelectorAll('.service-card');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    cards.forEach((card, i) => {
        if (i === index) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}


document.querySelectorAll('.service-card').forEach((card, index) => {
    card.addEventListener('click', () => {
        changeService(index);
    });
});

