// Données des slides
const slides = [
    {
        "image": "slide1.jpg",
        "tagLine": "Impressions tous formats <span>en boutique et en ligne</span>"
    },
    {
        "image": "slide2.jpg",
        "tagLine": "Tirages haute définition grand format <span>pour vos bureaux et events</span>"
    },
    {
        "image": "slide3.jpg",
        "tagLine": "Grand choix de couleurs <span>de CMJN aux pantones</span>"
    },
    {
        "image": "slide4.png",
        "tagLine": "Autocollants <span>avec découpe laser sur mesure</span>"
    }
];

let currentSlideIndex = 0;

function showSlide(index) {
    // Met à jour l'index de la slide
    currentSlideIndex = index;
    
    // Met à jour l'image
    const bannerImage = document.querySelector('.banner-img img');
    bannerImage.src = `./assets/images/slideshow/${slides[index].image}`;

    // Met à jour le texte correspondant
    const tagLine = document.querySelector('#banner p');
    tagLine.innerHTML = slides[index].tagLine;

    // Met à jour le point actif
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, dotIndex) => {
        if (dotIndex === index) {
            dot.classList.add('dot_selected');
        } else {
            dot.classList.remove('dot_selected');
        }
    });
}

function moveSlide(direction) {
    let newIndex = currentSlideIndex + direction;
    const totalSlides = slides.length;

    // L'index reste dans les limites du tableau
    if (newIndex < 0) {
        newIndex = totalSlides - 1;
    } else if (newIndex >= totalSlides) {
        newIndex = 0;
    }

    // Affiche la nouvelle slide
    showSlide(newIndex);
}
