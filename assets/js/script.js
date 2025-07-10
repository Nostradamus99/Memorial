// Fonction pour la gestion dynamique du bouton auth/profil
document.addEventListener('DOMContentLoaded', function() {
    const btnAuth = document.getElementById('btn-auth');
    
    if (btnAuth) {
        // 🔍 Vérifier si un utilisateur est connecté
        const utilisateur = localStorage.getItem('utilisateur');
        const userProfile = localStorage.getItem('userProfile');
        
        if (utilisateur || userProfile) {
            // 👤 Utilisateur connecté - Transformer en bouton profil
            console.log('✅ Utilisateur connecté - Affichage du bouton profil');
            
            btnAuth.textContent = 'Mon Profil';
            btnAuth.title = 'Accéder à mon profil';
            
            // Redirection vers la page profil
            btnAuth.addEventListener('click', function() {
                console.log('🔄 Redirection vers le profil...');
                window.location.href = 'profil.html'; // Ajustez selon votre structure
            });
            
        } else {
            // 🚪 Utilisateur non connecté - Garder le bouton auth
            console.log('❌ Utilisateur non connecté - Affichage du bouton auth');
            
            btnAuth.textContent = 'S\'inscrire/Connexion';
            btnAuth.title = 'Se connecter ou créer un compte';
            
            // Redirection vers la page authentification
            btnAuth.addEventListener('click', function() {
                console.log('🔄 Redirection vers auth.html...');
                window.location.href = 'auth.html';
            });
        }
    }
});

// Mémoriaux
document.addEventListener('DOMContentLoaded', function() {
    const boutonMemoriaux = document.getElementById("btn-memorials");

    boutonMemoriaux.addEventListener('click', function() {
        
        window.location.href = 'memoriaux.html';
    });
});
