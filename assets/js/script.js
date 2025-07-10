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
        
        // Déterminer le statut et la classe CSS
        let statutTexte = '';
        let statutClasse = '';
        
        if (memorial.statut === 'brouillon') {
            statutTexte = '📝 Brouillon';
            statutClasse = 'statut-brouillon';
        } else if (memorial.statut === 'publie') {
            if (memorial.public === true) {
                statutTexte = '🌍 Public';
                statutClasse = 'statut-public';
            } else {
                statutTexte = '🔒 Privé';
                statutClasse = 'statut-prive';
            }
        }
        
        div.innerHTML = `
            <div class="memorial-preview-card">
                <div class="memorial-header">
                    <h3>${memorial.nom || 'Mémorial sans nom'}</h3>
                    <span class="memorial-statut ${statutClasse}">${statutTexte}</span>
                </div>
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

// ==========================================
// 📤 SYSTÈME DE PUBLICATION
// ==========================================

// Fonction pour publier un mémorial
function publierMemorial(memorialId) {
    const memoriaux = JSON.parse(localStorage.getItem('memoriaux') || '[]');
    const memorial = memoriaux.find(m => m.id === memorialId);
    
    if (!memorial) {
        alert('Mémorial non trouvé');
        return;
    }
    
    // Récupérer l'état de la checkbox
    const checkboxPublic = document.getElementById('memorial-public');
    const estPublic = checkboxPublic ? checkboxPublic.checked : false;
    
    // Mettre à jour le statut
    memorial.statut = 'publie';
    memorial.public = estPublic;
    memorial.datePublication = new Date().toISOString();
    
    // Sauvegarder
    localStorage.setItem('memoriaux', JSON.stringify(memoriaux));
    
    alert(`Mémorial publié avec succès !`);
    
    // TODO: Redirection vers la page du mémorial
    // window.location.href = `memorial-${memorialId}.html`;
}

// Event listeners pour les boutons publier
document.addEventListener('DOMContentLoaded', function() {
    // Bouton publier création
    const btnPublierCreer = document.getElementById('btn-publier-creer');
    if (btnPublierCreer) {
        btnPublierCreer.addEventListener('click', function() {
            // Récupérer et sauvegarder les données du formulaire
            const donneesFormulaire = recupererDonneesFormulaire();
            
            // Créer un nouvel ID
            const memorialId = Date.now();
            donneesFormulaire.id = memorialId;
            donneesFormulaire.statut = 'brouillon'; // D'abord en brouillon
            
            // Sauvegarder le mémorial
            const memoriaux = JSON.parse(localStorage.getItem('memoriaux') || '[]');
            memoriaux.push(donneesFormulaire);
            localStorage.setItem('memoriaux', JSON.stringify(memoriaux));
            
            // Puis publier
            publierMemorial(memorialId);
        });
    }
    
    // Bouton publier modification
    const btnPublierModifier = document.getElementById('btn-publier-modifier');
    if (btnPublierModifier) {
        btnPublierModifier.addEventListener('click', function() {
            // Récupérer l'ID depuis l'URL
            const urlParams = new URLSearchParams(window.location.search);
            const memorialId = parseInt(urlParams.get('id'));
            
            if (memorialId) {
                // Récupérer et sauvegarder les modifications
                const donneesFormulaire = recupererDonneesFormulaire();
                
                const memoriaux = JSON.parse(localStorage.getItem('memoriaux') || '[]');
                const index = memoriaux.findIndex(m => m.id === memorialId);
                
                if (index !== -1) {
                    // Conserver l'ID et mettre à jour les données
                    donneesFormulaire.id = memorialId;
                    memoriaux[index] = donneesFormulaire;
                    localStorage.setItem('memoriaux', JSON.stringify(memoriaux));
                    
                    // Puis publier
                    publierMemorial(memorialId);
                } else {
                    alert('Mémorial non trouvé');
                }
            }
        });
    }
});

// 📋 AFFICHAGE DES MÉMORIAUX PUBLICS
// ==========================================

// Fonction pour afficher les mémoriaux publics
function afficherMemoriauxPublics() {
    const container = document.getElementById('memoriaux-publics');
    if (!container) return;
    
    const memoriaux = JSON.parse(localStorage.getItem('memoriaux') || '[]');
    
    // Filtrer les mémoriaux publics uniquement
    const memoriauxPublics = memoriaux.filter(memorial => 
        memorial.statut === 'publie' && memorial.public === true
    );
    
    // Vider le conteneur
    container.innerHTML = '';
    
    // Si aucun mémorial public
    if (memoriauxPublics.length === 0) {
        container.innerHTML = '<p class="no-memoriaux">Aucun mémorial public pour le moment.</p>';
        return;
    }
    
    // Créer les cartes pour chaque mémorial
    memoriauxPublics.forEach(memorial => {
        const card = creerCarteMemorial(memorial);
        container.appendChild(card);
    });
}

// Fonction pour créer une carte mémorial
function creerCarteMemorial(memorial) {
    const article = document.createElement('article');
    article.className = 'memorial-card';
    
    // Construire les dates
    const dateNaissance = memorial.dateNaissance || '';
    const dateDeces = memorial.dateDeces || '';
    const dates = dateNaissance && dateDeces ? `${dateNaissance} - ${dateDeces}` : 
                  dateNaissance ? `Né(e) en ${dateNaissance}` :
                  dateDeces ? `Décédé(e) en ${dateDeces}` : '';
    
    // Construire la bio (extrait)
    const bio = memorial.biographie || memorial.histoire || 'Aucune biographie disponible.';
    const bioExtrait = bio.length > 100 ? bio.substring(0, 100) + '...' : bio;
    
    // Photo (à adapter selon tes besoins)
    const photoSrc = memorial.photo || 'photos/default-profile.jpg';
    
    article.innerHTML = `
        <figure class="memorial-photo">
            <img src="${photoSrc}" alt="Photo de ${memorial.prenom || ''} ${memorial.nom || ''}">
            <figcaption>${memorial.prenom || ''} ${memorial.nom || ''}</figcaption>
        </figure>
        <div class="memorial-info">
            <h3>${memorial.prenom || ''} ${memorial.nom || ''}</h3>
            <p class="memorial-dates">${dates}</p>
            <p class="memorial-bio">${bioExtrait}</p>
            <a href="memorial-${memorial.id}.html" class="memorial-link">Voir le mémorial</a>
        </div>
    `;
    
    return article;
}

// Charger les mémoriaux au chargement de la page memoriaux.html
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si on est sur la page memoriaux.html
    if (document.getElementById('memoriaux-publics')) {
        afficherMemoriauxPublics();
    }
});
