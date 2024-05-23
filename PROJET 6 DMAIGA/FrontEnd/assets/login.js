document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('user-login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêcher le rechargement de la page lors de la soumission du formulaire

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        fetch('http://localhost:5678/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur dans l’identifiant ou le mot de passe');
            }
            return response.json();
        })
        .then(data => {
            const token = data.token;
            localStorage.setItem('authToken', token); // Stocker le token dans le localStorage
            window.location.href = 'index.html'; // Rediriger vers la page d'accueil
        })
        .catch(error => {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
    });
});
