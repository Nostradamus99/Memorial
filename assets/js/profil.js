// GESTION DU PROFIL
document.addEventListener('DOMContentLoaded', function() {
    
    // Vérifier si l'utilisateur est connecté
    const utilisateurConnecte = localStorage.getItem('utilisateurConnecte');
    
    if (utilisateurConnecte !== 'true') {
        // Rediriger vers la page de connexion si pas connecté
        window.location.href = 'auth.html';
        return;
    }
    
    // Récupérer les données utilisateur
    const utilisateurStocke = localStorage.getItem('utilisateur');
    
    if (utilisateurStocke) {
        const utilisateur = JSON.parse(utilisateurStocke);
        
        // Remplacer les données statiques
        document.getElementById('nom-profil').textContent = utilisateur.nom;
        document.getElementById('email-profil').textContent = utilisateur.email;
        
        console.log('✅ Profil mis à jour !');
    }
});
