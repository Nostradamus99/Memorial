// Création de mémorial
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Script chargé !');
    
    // On récupère le formulaire principal pour empêcher la soumission automatique
    const formulaire = document.querySelector('.memorial-form');
    if (formulaire) {
        formulaire.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('Soumission formulaire bloquée');
        });
    }
    
    // On sélectionne le bouton sauvegarder
    const btnSauvegarder = document.getElementById('btn-sauvegarder');
    
    // Fonction : Collecter toutes les données du formulaire
    function collecterDonnees() {
        console.log('🔍 Collecte des données...');
        return {
            prenom: document.getElementById('memorial-prenom')?.value || '',
            nom: document.getElementById('memorial-nom')?.value || '',
            dateNaissance: document.getElementById('memorial-date-naissance')?.value || '',
            dateDeces: document.getElementById('memorial-date-deces')?.value || '',
            lieuNaissance: document.getElementById('memorial-lieu-naissance')?.value || '',
            lieuDeces: document.getElementById('memorial-lieu-deces')?.value || '',
            biographie: document.getElementById('memorial-biographie')?.value || '',
            visible: document.querySelector('input[name="visible_public"]')?.checked || false,
            commentaires: document.querySelector('input[name="commentaires_autorises"]')?.checked || false,
            notifications: document.querySelector('input[name="notifications_messages"]')?.checked || false,
            dateCreation: new Date().toISOString()
        };
    }
    
    // Fonction : Sauvegarder en localStorage
    function sauvegarderBrouillon() {
        console.log('💾 Début sauvegarde...');
        const donnees = collecterDonnees();
        console.log('Données collectées:', donnees);
        
        localStorage.setItem('memorial-brouillon', JSON.stringify(donnees));
        console.log('✅ Sauvegarde terminée !');
        alert('Brouillon sauvegardé avec succès !');
    }
    
    // Écouteur d'événement pour le bouton sauvegarder
    if (btnSauvegarder) {
        btnSauvegarder.addEventListener('click', function() {
            console.log('🖱️ Clic sur sauvegarder détecté !');
            sauvegarderBrouillon();
        });
    }
});
