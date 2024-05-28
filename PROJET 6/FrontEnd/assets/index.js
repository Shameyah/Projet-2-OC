const gallery = document.querySelector('.gallery');
const filtersContainer = document.querySelector('#all-filters');
let works = []; // Pour stocker les projets
let categories = []; // Pour stocker les catégories

// Fonction pour afficher les projet en ajouter un element Figure à la galerie
function displayWorks(works) {
    gallery.innerHTML = ''; // Nettoyer la galerie avant d'afficher les projets
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

// Fonction pour afficher les projets filtrés
function  displayFilteredWorks(categoryId) {
    gallery.innerHTML = ''; // Nettoyer la galerie
    const filteredWorks = categoryId === 'all' ? works : works.filter(work => work.categoryId === categoryId);
    displayWorks(filteredWorks);
    updateActiveFilter(categoryId); // Mettre à jour l'état actif des filtres
}

// Fonction pour générer les filtres de catégories
function generateCategoryFilters() {
    const allFilter = document.createElement('button');
    allFilter.textContent = 'Tous';
    allFilter.classList.add('filters-design', 'filter-all');
    allFilter.addEventListener('click', () => displayFilteredWorks('all'));
    filtersContainer.appendChild(allFilter);

    categories.forEach(category => {
        const filter = document.createElement('button');
        filter.textContent = category.name;
        filter.classList.add('filters-design');
        filter.addEventListener('click', () => displayFilteredWorks(category.id));
        filtersContainer.appendChild(filter);
        
    
    });
}

// Fonction pour mettre à jour l'etat actif des filtres
function updateActiveFilter(categoryId) {
    const filters = filtersContainer.querySelectorAll('button');
      filters.forEach(filter => {
          filter.classList.remove('filter-active');
          if (filter.textContent === 'Tous' && categoryId === 'all') {
              filter.classList.add('filter-active');
          } else if (filter.textContent === categories.find(category => category.id === categoryId)?.name) {
              filter.classList.add('filter-active');
          }
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

// Récupérer les categories via l'API
fetch('http://localhost:5678/api/categories')
      .then(response => response.json())
      .then(data => {
          categories = data; // Stocker les catégories
          generateCategoryFilters(); // Générer les filtres
      })
      .catch(error => console.error('Erreur lors de la récupération des catégories :', error));