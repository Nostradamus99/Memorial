// modifier-memorial.js
// Logique pour modifier un mémorial existant

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page de modification chargée');
    
    // Vérifier que memorial-storage.js est bien chargé
    if (typeof memorialStorage === 'undefined') {
        console.error('memorialStorage non disponible - vérifiez que memorial-storage.js est chargé');
        alert('Erreur: Système de stockage non disponible. Vérifiez que tous les scripts sont chargés.');
        return;
    }
    
    // Récupérer l'ID depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const memorialId = urlParams.get('id');
    
    console.log('ID récupéré de l\'URL:', memorialId);
    
    if (memorialId) {
        console.log('ID du mémorial à modifier:', memorialId);
        loadMemorialData(memorialId);
    } else {
        console.error('Aucun ID de mémorial fourni dans l\'URL');
        alert('Erreur: Aucun mémorial à modifier (ID manquant dans l\'URL)');
        // Rediriger vers profil après 2 secondes
        setTimeout(() => {
            window.location.href = 'profil.html';
        }, 2000);
    }
});

// Charger les données du mémorial dans le formulaire
function loadMemorialData(memorialId) {
    try {
        console.log('Tentative de chargement du mémorial:', memorialId);
        
        // Vérifier à nouveau que memorialStorage est disponible
        if (typeof memorialStorage === 'undefined') {
            throw new Error('memorialStorage non disponible');
        }
        
        // Récupérer tous les mémoriaux pour debug
        const allMemorials = memorialStorage.getAllMemorials();
        console.log('Tous les mémoriaux disponibles:', allMemorials);
        
        // Récupérer le mémorial spécifique
        const memorial = memorialStorage.getMemorialById(memorialId);
        console.log('Mémorial trouvé:', memorial);
        
        if (!memorial) {
            console.error('Mémorial non trouvé avec ID:', memorialId);
            alert(`Mémorial non trouvé avec l'ID: ${memorialId}`);
            setTimeout(() => {
                window.location.href = 'profil.html';
            }, 2000);
            return;
        }
        
        console.log('Chargement des données:', memorial);
        
        // Remplir le formulaire avec les données existantes
        fillForm(memorial);
        
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        alert('Erreur lors du chargement du mémorial: ' + error.message);
        
        // Rediriger vers profil après 2 secondes
        setTimeout(() => {
            window.location.href = 'profil.html';
        }, 2000);
    }
}

// Remplir le formulaire avec les données du mémorial
function fillForm(memorial) {
    console.log('Remplissage du formulaire avec:', memorial);
    
    let fieldsFound = 0;
    let fieldsSet = 0;
    
    // Remplir tous les champs du formulaire
    Object.keys(memorial).forEach(key => {
        const input = document.querySelector(`[name="${key}"]`);
        if (input) {
            fieldsFound++;
            try {
                if (input.type === 'checkbox') {
                    input.checked = memorial[key] === true || memorial[key] === 1 || memorial[key] === '1';
                } else {
                    input.value = memorial[key] || '';
                }
                fieldsSet++;
                console.log(`Champ ${key} rempli avec:`, memorial[key]);
            } catch (error) {
                console.error(`Erreur lors du remplissage du champ ${key}:`, error);
            }
        } else {
            console.log(`Champ ${key} non trouvé dans le formulaire`);
        }
    });
    
    // Mettre l'ID dans le champ caché
    const hiddenId = document.querySelector('input[name="memorial_id"]');
    if (hiddenId) {
        hiddenId.value = memorial.id;
        console.log('ID caché défini:', memorial.id);
    } else {
        console.warn('Champ memorial_id caché non trouvé');
    }
    
    console.log(`Formulaire rempli: ${fieldsSet}/${fieldsFound} champs trouvés`);
    
    // Afficher un message de succès
    showSuccessMessage(`Mémorial de ${memorial.prenom} ${memorial.nom} chargé pour modification`);
}

// Afficher un message de succès
function showSuccessMessage(message) {
    // Créer le conteneur de message s'il n'existe pas
    let messageContainer = document.getElementById('message-container');
    
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'message-container';
        messageContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 300px;
        `;
        document.body.appendChild(messageContainer);
    }
    
    // Créer le message
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        padding: 15px;
        margin-bottom: 10px;
        border-radius: 5px;
        background-color: #28a745;
        color: white;
        font-weight: bold;
        animation: slideIn 0.3s ease;
    `;
    
    messageDiv.textContent = message;
    messageContainer.appendChild(messageDiv);
    
    // Supprimer le message après 3 secondes
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Fonction pour déboguer - à appeler depuis la console
function debugMemorialStorage() {
    console.log('=== DEBUG MEMORIAL STORAGE ===');
    console.log('memorialStorage disponible:', typeof memorialStorage !== 'undefined');
    
    if (typeof memorialStorage !== 'undefined') {
        const allMemorials = memorialStorage.getAllMemorials();
        console.log('Nombre de mémoriaux:', allMemorials.length);
        console.log('Tous les mémoriaux:', allMemorials);
        
        allMemorials.forEach((memorial, index) => {
            console.log(`Mémorial ${index + 1}:`, {
                id: memorial.id,
                nom: memorial.nom,
                prenom: memorial.prenom,
                statut: memorial.statut
            });
        });
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const memorialId = urlParams.get('id');
    console.log('ID depuis URL:', memorialId);
}

// Ajouter les styles CSS pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);