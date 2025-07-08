// js/index.js - Logique spécifique à la page d'accueil

// Fonction pour la redirection vers la page d'authentification
document.addEventListener('DOMContentLoaded', function() { // Écouter l'événement DOMContentLoaded
    const btnAuth = document.getElementById('btn-auth'); // Récupérer le bouton d'authentification
    
    if (btnAuth) { // Vérifier si le bouton existe
        btnAuth.addEventListener('click', function() { // Ajouter un écouteur d'événement au bouton
            console.log('Redirection vers auth.html...'); // Afficher un message dans la console
            window.location.href = 'auth.html'; // Rediriger vers la page d'authentification
        });
    }
});
