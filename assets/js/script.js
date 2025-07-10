// ===========================================================
//  Fonction pour la gestion dynamique du bouton auth/profil
// ===========================================================
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
// ============
//  Mémoriaux
// ============
document.addEventListener('DOMContentLoaded', function() {
    const boutonMemoriaux = document.getElementById("btn-memorials");

    boutonMemoriaux.addEventListener('click', function() {
        
        window.location.href = 'memoriaux.html';
    });
});

// ==========================================
//     SYSTÈME DE GESTION DES MÉMORIAUX
// ==========================================

// 📦 Fonction pour récupérer tous les champs d'un formulaire
function recupererDonneesFormulaire() {
    const donnees = {};
    
    // Récupère tous les inputs, textareas et selects
    const champs = document.querySelectorAll('input, textarea, select');
    
    champs.forEach(champ => {
        if (champ.id) { // Seulement les champs avec un ID
            if (champ.type === 'checkbox' || champ.type === 'radio') {
                donnees[champ.id] = champ.checked;
            } else if (champ.type === 'file') {
                if (champ.files && champ.files[0]) {
                    // Convertir le fichier en base64 pour le stockage
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        donnees[champ.id] = e.target.result;
                        sauvegarderDansStorage(donnees);
                    };
                    reader.readAsDataURL(champ.files[0]);
                    return; // Sortir de la fonction car traitement asynchrone
                }
            } else {
                donnees[champ.id] = champ.value;
            }
        }
    });
    
    return donnees;
}

// 💾 Fonction pour sauvegarder dans le localStorage
function sauvegarderDansStorage(donnees) {
    // Récupérer les mémoriaux existants
    let memoriaux = JSON.parse(localStorage.getItem('memoriaux') || '[]');
    
    // Ajouter un ID unique et une date
    donnees.id = Date.now(); // ID unique basé sur timestamp
    donnees.dateCreation = new Date().toLocaleDateString('fr-FR');
    
    // Ajouter le nouveau mémorial
    memoriaux.push(donnees);
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('memoriaux', JSON.stringify(memoriaux));
    
    // Message de confirmation
    alert('✅ Mémorial sauvegardé avec succès !');
    
    // Rediriger vers le profil
    window.location.href = 'profil.html';
}

// 🔄 Fonction pour modifier un mémorial existant
function modifierMemorial(donnees, id) {
    let memoriaux = JSON.parse(localStorage.getItem('memoriaux') || '[]');
    
    // Trouver et modifier le mémorial
    const index = memoriaux.findIndex(m => m.id == id);
    if (index !== -1) {
        donnees.id = id; // Garder l'ID original
        donnees.dateModification = new Date().toLocaleDateString('fr-FR');
        memoriaux[index] = donnees;
        
        localStorage.setItem('memoriaux', JSON.stringify(memoriaux));
        alert('✅ Mémorial modifié avec succès !');
        window.location.href = 'profil.html';
    }
}

// 🗑️ Fonction pour supprimer un mémorial
function supprimerMemorial(id) {
    if (confirm('❌ Êtes-vous sûr de vouloir supprimer ce mémorial ?')) {
        let memoriaux = JSON.parse(localStorage.getItem('memoriaux') || '[]');
        memoriaux = memoriaux.filter(m => m.id != id);
        localStorage.setItem('memoriaux', JSON.stringify(memoriaux));
        afficherMemoriaux(); // Rafraîchir l'affichage
        alert('✅ Mémorial supprimé !');
    }
}

// 📋 Fonction pour afficher les mémoriaux dans le profil
function afficherMemoriaux() {
    const container = document.getElementById('memorial-container');
    const compteur = document.getElementById('memorial-count');
    
    if (!container) return; // Pas sur la page profil
    
    const memoriaux = JSON.parse(localStorage.getItem('memoriaux') || '[]');
    
    // Mettre à jour le compteur
    if (compteur) {
        compteur.textContent = memoriaux.length;
    }
    
    // Vider le container
    container.innerHTML = '';
    
    if (memoriaux.length === 0) {
        container.innerHTML = '<p>Aucun mémorial créé pour le moment.</p>';
        return;
    }
    
    // Afficher les mémoriaux (les 3 derniers)
    const derniersMemoriaux = memoriaux.slice(-3);
    
    derniersMemoriaux.forEach(memorial => {
        const div = document.createElement('div');
        div.className = 'memorial-item';
        div.innerHTML = `
            <div class="memorial-preview-card">
                <h3>${memorial.nom || 'Mémorial sans nom'}</h3>
                <p><strong>Créé le :</strong> ${memorial.dateCreation}</p>
                ${memorial.dateModification ? `<p><strong>Modifié le :</strong> ${memorial.dateModification}</p>` : ''}
                <div class="memorial-actions">
                    <button onclick="chargerPourModification(${memorial.id})" class="btn btn-secondary">
                        ✏️ Modifier
                    </button>
                    <button onclick="supprimerMemorial(${memorial.id})" class="btn btn-danger">
                        🗑️ Supprimer
                    </button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

// ✏️ Fonction pour charger un mémorial pour modification
function chargerPourModification(id) {
    // Stocker l'ID du mémorial à modifier
    localStorage.setItem('memorial-a-modifier', id);
    // Rediriger vers la page de modification
    window.location.href = 'modifier-memorial.html';
}

// 🔄 Fonction pour charger les données dans le formulaire de modification
function chargerDonneesModification() {
    const id = localStorage.getItem('memorial-a-modifier');
    if (!id) return;
    
    const memoriaux = JSON.parse(localStorage.getItem('memoriaux') || '[]');
    const memorial = memoriaux.find(m => m.id == id);
    
    if (!memorial) return;
    
    // Remplir tous les champs
    Object.keys(memorial).forEach(cle => {
        const champ = document.getElementById(cle);
        if (champ) {
            if (champ.type === 'checkbox' || champ.type === 'radio') {
                champ.checked = memorial[cle];
            } else if (champ.type === 'file') {
                // Les fichiers ne peuvent pas être rechargés pour des raisons de sécurité
                // Tu peux afficher un aperçu si c'est une image
            } else {
                champ.value = memorial[cle];
            }
        }
    });
}

// 🚀 INITIALISATION - Code qui s'exécute au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    
    // === PAGE CRÉATION ===
    const btnCreer = document.getElementById('btn-sauvegarder-creer');
    if (btnCreer) {
        btnCreer.addEventListener('click', function() {
            const donnees = recupererDonneesFormulaire();
            sauvegarderDansStorage(donnees);
        });
    }
    
    // === PAGE MODIFICATION ===
    const btnModifier = document.getElementById('btn-sauvegarder-modifier');
    if (btnModifier) {
        // Charger les données existantes
        chargerDonneesModification();
        
        // Gérer la sauvegarde
        btnModifier.addEventListener('click', function() {
            const donnees = recupererDonneesFormulaire();
            const id = localStorage.getItem('memorial-a-modifier');
            modifierMemorial(donnees, id);
        });
    }
    
    // === PAGE PROFIL ===
    const container = document.getElementById('memorial-container');
    if (container) {
        afficherMemoriaux();
    }
    
});

document.addEventListener('DOMContentLoaded', function() {
    const boutonMemoriaux = document.getElementById("btn-retour");

    boutonMemoriaux.addEventListener('click', function() {
        
        window.location.href = 'profil.html';
    });
});