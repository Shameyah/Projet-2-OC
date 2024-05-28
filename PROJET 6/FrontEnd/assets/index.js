const gallery = document.querySelector('.gallery');
let works = []; // Pour stocker les projets

function displayWorks(works) {
    works.forEach(work => {
        console.log('Affichage du projet:', work); // Vérification des données du projet

        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = work.imageUrl;
        img.alt = work.title;    
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
        
    });
    
}

// Récupérer les données des travaux via l'API
fetch ('http://localhost:5678/api/works/')
    .then(response => response.json())
    .then(data => {
        works = data; // stocker les projets
        console.log('Données des travaux récupérées:', works); // Vérification des données récupérées
        displayWorks(works); // Afficher les projets
    })
    .catch(error => console.error('Erreur lors de la recuperation:', error));