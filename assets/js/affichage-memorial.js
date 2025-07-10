// affichage-memorial.js
// Gestion de l'affichage des mémoriaux dans le profil

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page profil chargée');
    
    // Initialiser l'affichage des mémoriaux
    const memorialDisplay = new MemorialDisplay();
    memorialDisplay.init();
});

// Classe pour gérer l'affichage des mémoriaux
class MemorialDisplay {
    constructor() {
        this.container = document.getElementById('memorial-container');
        this.countElement = document.getElementById('memorial-count');
        this.voirTousBtn = document.getElementById('voir-tous-btn');
        this.memorials = [];
    }

    // Initialiser l'affichage
    init() {
        if (!this.container) {
            console.error('Conteneur des mémoriaux non trouvé');
            return;
        }

        console.log('Initialisation de l\'affichage des mémoriaux');
        
        // Charger les mémoriaux depuis le stockage local
        this.loadMemorials();
        
        // Afficher les mémoriaux
        this.displayMemorials();
        
        // Mettre à jour le compteur
        this.updateCount();
    }

    // Charger les mémoriaux depuis le localStorage
    loadMemorials() {
        try {
            // Vérifier si memorialStorage est disponible
            if (typeof memorialStorage !== 'undefined') {
                this.memorials = memorialStorage.getAllMemorials();
                console.log('Mémoriaux chargés:', this.memorials.length);
            } else {
                console.error('memorialStorage non disponible');
                this.memorials = [];
            }
        } catch (error) {
            console.error('Erreur lors du chargement des mémoriaux:', error);
            this.memorials = [];
        }
    }

    // Afficher les mémoriaux dans le conteneur
    displayMemorials() {
        // Vider le conteneur
        this.container.innerHTML = '';

        // Si aucun mémorial
        if (this.memorials.length === 0) {
            this.showEmptyState();
            return;
        }

        // Trier les mémoriaux par date de création (plus récents d'abord)
        const sortedMemorials = this.memorials.sort((a, b) => {
            return new Date(b.date_creation) - new Date(a.date_creation);
        });

        // Afficher seulement les 3 plus récents pour la prévisualisation
        const memorialsToShow = sortedMemorials.slice(0, 3);

        // Créer les cartes pour chaque mémorial
        memorialsToShow.forEach(memorial => {
            const memorialCard = this.createMemorialCard(memorial);
            this.container.appendChild(memorialCard);
        });

        console.log(`Affichage de ${memorialsToShow.length} mémoriaux`);
    }

    // Créer une carte mémorial
    createMemorialCard(memorial) {
        // Créer l'élément principal
        const card = document.createElement('div');
        card.className = 'memorial-card';
        card.setAttribute('data-memorial-id', memorial.id);
        
        // Ajouter les styles inline pour une présentation simple
        card.style.cssText = `
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s ease;
        `;

        // Effet hover
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });

        // Contenu HTML de la carte
        card.innerHTML = `
            <div class="memorial-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div class="memorial-info" style="flex: 1;">
                    <h3 style="margin: 0; color: #333; font-size: 1.2em;">
                        ${this.escapeHtml(memorial.prenom || 'Sans nom')} ${this.escapeHtml(memorial.nom || '')}
                    </h3>
                    <p style="margin: 5px 0; color: #666; font-size: 0.9em;">
                        ${this.formatDate(memorial.date_creation)}
                    </p>
                </div>
                <div class="memorial-status">
                    <span class="status-badge ${memorial.statut}" style="
                        padding: 4px 8px;
                        border-radius: 12px;
                        font-size: 0.8em;
                        font-weight: bold;
                        ${memorial.statut === 'publie' ? 'background: #d4edda; color: #155724;' : 'background: #fff3cd; color: #856404;'}
                    ">
                        ${memorial.statut === 'publie' ? '✅ Publié' : '📝 Brouillon'}
                    </span>
                </div>
            </div>
            
            <div class="memorial-content" style="margin-bottom: 15px;">
                ${memorial.biographie ? `
                    <p style="margin: 0; color: #555; font-size: 0.9em; line-height: 1.4;">
                        ${this.truncateText(this.escapeHtml(memorial.biographie), 100)}
                    </p>
                ` : ''}
                
                ${memorial.date_naissance || memorial.date_deces ? `
                    <p style="margin: 8px 0 0 0; color: #888; font-size: 0.85em;">
                        ${memorial.date_naissance ? this.formatDate(memorial.date_naissance) : '?'} - 
                        ${memorial.date_deces ? this.formatDate(memorial.date_deces) : '?'}
                    </p>
                ` : ''}
            </div>
            
            <div class="memorial-actions" style="display: flex; gap: 10px; justify-content: flex-end;">
                <button class="btn-modifier" onclick="memorialDisplayInstance.editMemorial('${memorial.id}')" style="
                    padding: 6px 12px;
                    border: 1px solid #28a745;
                    background: white;
                    color: #28a745;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.85em;
                    transition: all 0.2s ease;
                ">
                    ✏️ Modifier
                </button>
                
                <button class="btn-supprimer" onclick="memorialDisplayInstance.deleteMemorial('${memorial.id}')" style="
                    padding: 6px 12px;
                    border: 1px solid #dc3545;
                    background: white;
                    color: #dc3545;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.85em;
                    transition: all 0.2s ease;
                ">
                    🗑️ Supprimer
                </button>
            </div>
        `;

        // Ajouter les effets hover pour les boutons
        const buttons = card.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (button.classList.contains('btn-voir')) {
                    button.style.background = '#007bff';
                    button.style.color = 'white';
                } else if (button.classList.contains('btn-modifier')) {
                    button.style.background = '#28a745';
                    button.style.color = 'white';
                } else if (button.classList.contains('btn-supprimer')) {
                    button.style.background = '#dc3545';
                    button.style.color = 'white';
                }
            });

            button.addEventListener('mouseleave', () => {
                button.style.background = 'white';
                if (button.classList.contains('btn-voir')) {
                    button.style.color = '#007bff';
                } else if (button.classList.contains('btn-modifier')) {
                    button.style.color = '#28a745';
                } else if (button.classList.contains('btn-supprimer')) {
                    button.style.color = '#dc3545';
                }
            });
        });

        return card;
    }

    // Afficher l'état vide (aucun mémorial)
    showEmptyState() {
        this.container.innerHTML = `
            <div class="empty-state" style="
                text-align: center;
                padding: 40px 20px;
                color: #666;
                background: #f8f9fa;
                border-radius: 8px;
                border: 2px dashed #dee2e6;
            ">
                <div style="font-size: 3em; margin-bottom: 15px;">📝</div>
                <h3 style="margin: 0 0 10px 0; color: #495057;">Aucun mémorial créé</h3>
                <p style="margin: 0 0 20px 0; color: #6c757d;">
                    Vous n'avez pas encore créé de mémorial. Commencez dès maintenant !
                </p>
                <a href="creer-memorial.html" style="
                    display: inline-block;
                    padding: 10px 20px;
                    background: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background 0.2s ease;
                ">
                    ✨ Créer mon premier mémorial
                </a>
            </div>
        `;
    }

    // Mettre à jour le compteur
    updateCount() {
        if (this.countElement) {
            this.countElement.textContent = this.memorials.length;
        }
    }

    // Voir un mémorial (fonctionnalité future)
    viewMemorial(memorialId) {
        console.log('Voir le mémorial:', memorialId);
        
        // Pour l'instant, on affiche les détails dans la console
        const memorial = this.memorials.find(m => m.id === memorialId);
        if (memorial) {
            console.log('Détails du mémorial:', memorial);
            alert(`Mémorial de ${memorial.prenom} ${memorial.nom}\nStatut: ${memorial.statut}\nCréé le: ${this.formatDate(memorial.date_creation)}`);
        }
        
        // TODO: Rediriger vers la page de visualisation
        // window.location.href = `voir-memorial.html?id=${memorialId}`;
    }

    // Modifier un mémorial
    editMemorial(memorialId) {
        console.log('Modifier le mémorial:', memorialId);
        
        // Rediriger vers la page de modification avec l'ID
        window.location.href = `modifier-memorial.html?id=${memorialId}`;
    }

    // Supprimer un mémorial
    deleteMemorial(memorialId) {
        console.log('Supprimer le mémorial:', memorialId);
        
        // Trouver le mémorial
        const memorial = this.memorials.find(m => m.id === memorialId);
        if (!memorial) {
            console.error('Mémorial non trouvé');
            return;
        }

        // Demander confirmation
        const confirmMessage = `Êtes-vous sûr de vouloir supprimer le mémorial de ${memorial.prenom} ${memorial.nom} ?\n\nCette action est irréversible.`;
        
        if (confirm(confirmMessage)) {
            try {
                // Supprimer du stockage
                memorialStorage.deleteMemorial(memorialId);
                
                // Recharger les mémoriaux
                this.loadMemorials();
                
                // Réafficher
                this.displayMemorials();
                
                // Mettre à jour le compteur
                this.updateCount();
                
                // Afficher un message de succès
                this.showMessage('Mémorial supprimé avec succès', 'success');
                
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                this.showMessage('Erreur lors de la suppression', 'error');
            }
        }
    }

    // Actualiser l'affichage
    refresh() {
        this.loadMemorials();
        this.displayMemorials();
        this.updateCount();
    }

    // Utilitaires
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        };
        
        return date.toLocaleDateString('fr-FR', options);
    }

    // Afficher un message à l'utilisateur
    showMessage(message, type = 'info') {
        // Créer ou récupérer le conteneur de messages
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
        messageDiv.className = `message message-${type}`;
        messageDiv.style.cssText = `
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            animation: slideIn 0.3s ease;
        `;
        
        // Couleurs selon le type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#007bff',
            warning: '#ffc107'
        };
        
        messageDiv.style.backgroundColor = colors[type] || colors.info;
        messageDiv.textContent = message;
        
        // Ajouter le message
        messageContainer.appendChild(messageDiv);
        
        // Supprimer le message après 3 secondes
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Créer une instance globale pour pouvoir l'utiliser dans les onclick
let memorialDisplayInstance;

// Initialiser l'instance globale quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    memorialDisplayInstance = new MemorialDisplay();
});

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
