document.addEventListener('DOMContentLoaded', function () {
  const gallery = document.querySelector('.gallery');
  const filtersContainer = document.querySelector('#all-filters');
  let works = []; // Pour stocker les projets
  let categories = []; // Pour stocker les catégories

  // Fonction pour ajouter une figure à la galerie
  function addFigureToGallery(work) {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
  }

  // Fonction pour afficher les projets filtrés
  function displayFilteredWorks(categoryId) {
    gallery.innerHTML = ''; // Nettoyer la galerie
    works.filter(work => categoryId === 'all' || work.categoryId === categoryId)
      .forEach(work => addFigureToGallery(work));
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

  // Fonction pour mettre à jour l'état actif des filtres
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
  fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
      works = data; // Stocker les projets
      displayFilteredWorks('all'); // Afficher tous les projets par défaut
    })
    .catch(error => console.error('Erreur lors de la récupération des travaux :', error));

  // Récupérer les catégories via l'API
  fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(data => {
      categories = data; // Stocker les catégories
      generateCategoryFilters(); // Générer les filtres
    })
    .catch(error => console.error('Erreur lors de la récupération des catégories :', error));
});


document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const addPhotoModal = document.getElementById('add-photo-modal');
  const addPhotoModalClose = document.getElementById('add-photo-modal-close');
  const addProjectForm = document.getElementById('add-project-form');
  const modalError = document.getElementById('modal-error');
  const gallery = document.querySelector('.gallery');
  const projectThumbnails = document.getElementById('project-thumbnails');
  const addPhotoButton = document.getElementById('add-photo-button');
  const apiUrl = 'http://localhost:5678/api/works';
  const categoriesUrl = 'http://localhost:5678/api/categories';

  // Fonction pour ouvrir la modale de gestion des travaux
  const openModal = () => {
    modal.style.display = 'flex';
    fetchProjectsForModal();
    fetchCategories();
  };

  // Fonction pour fermer la modale de gestion des travaux
  const closeModal = () => {
    modal.style.display = 'none';
  };

  // Fonction pour ouvrir la modale d'ajout de photos
  const openAddPhotoModal = () => {
    addPhotoModal.style.display = 'flex';
    fetchCategories();
  };

  // Fonction pour fermer la modale d'ajout de photos
  const closeAddPhotoModal = () => {
    addPhotoModal.style.display = 'none';
    modalError.textContent = '';
    addProjectForm.reset();
  };

  // Événement pour fermer la modale en cliquant en dehors du contenu
  window.onclick = (event) => {
    if (event.target == modal) {
      closeModal();
    } else if (event.target == addPhotoModal) {
      closeAddPhotoModal();
    }
  };

  // Événement pour fermer la modale en cliquant sur la croix
  modalClose.onclick = () => {
    closeModal();
  };

  addPhotoModalClose.onclick = () => {
    closeAddPhotoModal();
  };

  // Événement pour ouvrir la modale de gestion des travaux
  document.querySelector('.open-modal-button').addEventListener('click', openModal);

  // Événement pour ouvrir la modale d'ajout de photos
  addPhotoButton.onclick = () => {
    openAddPhotoModal();
  };

  // Fonction pour charger les catégories
  const fetchCategories = async () => {
    try {
      const response = await fetch(categoriesUrl);
      const categories = await response.json();
      const categorySelect = document.getElementById('project-category');
      categorySelect.innerHTML = ''; // Réinitialiser les options
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  // Fonction pour charger les projets existants dans la modale
  const fetchProjectsForModal = async () => {
    try {
      const response = await fetch(apiUrl);
      const projects = await response.json();
      projectThumbnails.innerHTML = ''; // Réinitialiser les miniatures
      projects.forEach(project => {
        addThumbnailToModal(project);
      });
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    }
  };

  // Fonction pour ajouter une miniature à la modale
  const addThumbnailToModal = (project) => {
    const thumbnail = document.createElement('div');
    thumbnail.classList.add('thumbnail');
    thumbnail.innerHTML = `
          <img src="${project.imageUrl}" alt="${project.title}">
          <button class="delete-button" data-id="${project.id}">&times;</button>
      `;
    projectThumbnails.appendChild(thumbnail);
  };

  // Fonction pour ajouter un projet
  addProjectForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(addProjectForm);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du projet');
      }

      const newProject = await response.json();
      addProjectToDOM(newProject);
      addThumbnailToModal(newProject);
      closeAddPhotoModal();
    } catch (error) {
      modalError.textContent = error.message;
    }
  });

  // Fonction pour ajouter un projet au DOM
  const addProjectToDOM = (project) => {
    const projectElement = document.createElement('figure');
    projectElement.setAttribute('data-id', project.id);
    projectElement.innerHTML = `
          <img src="${project.imageUrl}" alt="${project.title}">
          <figcaption>${project.title}</figcaption>
      `;
    gallery.appendChild(projectElement);
  };

  // Événement pour supprimer un projet
  projectThumbnails.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-button')) {
      const projectId = event.target.dataset.id;

      try {
        const response = await fetch(`${apiUrl}/${projectId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression du projet');
        }

        event.target.closest('.thumbnail').remove();
        // Supprimer l'élément du DOM principal également
        document.querySelector(`figure[data-id="${projectId}"]`).remove();
      } catch (error) {
        console.error('Erreur lors de la suppression du projet:', error);
      }
    }
  });
});
