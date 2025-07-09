// INSCRIPTION
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-inscription').addEventListener('click', function(e) {
        e.preventDefault();
        
        let nom = document.getElementById('fullname').value;
        let email = document.getElementById('reg-email').value;
        let motDePasse = document.getElementById('reg-password').value;
        
        // Validations 
        if (nom === '' || email === '' || motDePasse === '') {
            alert('Veuillez remplir tous les champs !');
            return;
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            alert('Email invalide !');
            return;
        }
        
        if (motDePasse.length < 6) {
            alert('Le mot de passe doit contenir au moins 6 caractères !');
            return;
        }
        
        // Stockage
        let utilisateur = {
            nom: nom,
            email: email,
            motDePasse: motDePasse
        };
        
        localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
        
        alert('Inscription réussie ! Données sauvegardées !');
        console.log('Utilisateur créé:', utilisateur);

        // Connexion automatique
        localStorage.setItem('utilisateurConnecte', 'true');
        window.location.href = 'profil.html';
        
        alert('Inscription réussie ! Données sauvegardées !');
        console.log('Utilisateur créé:', utilisateur);
    });
});

// CONNEXION
document.getElementById('form-connexion')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email-connexion').value;
    const motDePasse = document.getElementById('password-connexion').value;
    
    const utilisateurStocke = localStorage.getItem('utilisateur');
    
    if (utilisateurStocke) {
        const utilisateur = JSON.parse(utilisateurStocke);
        
        if (email === utilisateur.email && motDePasse === utilisateur.motDePasse) {
            // Marquer l'utilisateur comme connecté
            localStorage.setItem('utilisateurConnecte', 'true');
            
            console.log('✅ CONNEXION RÉUSSIE !');
            alert('Bienvenue ' + utilisateur.nom + ' !');
            
            // Redirection vers le profil
            window.location.href = 'profil.html';
            
        } else {
            console.log('❌ IDENTIFIANTS INCORRECTS');
            alert('Email ou mot de passe incorrect !');
        }
    } else {
        alert('Aucun compte trouvé ! Veuillez vous inscrire.');
    }
});
