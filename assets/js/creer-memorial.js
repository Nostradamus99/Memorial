// creer-memorial.js
// Logique pour le formulaire de création de mémorial

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page de création de mémorial chargée');
    
    // Initialiser le gestionnaire du formulaire
    const memorialForm = new MemorialForm();
    memorialForm.init();
});

// Classe principale pour gérer le formulaire
class MemorialForm {
    constructor() {
        this.form = document.querySelector('.memorial-form');
        this.isFormValid = false;
        this.currentData = {};
    }

    // Initialiser tous les événements
    init() {
        if (!this.form) {
            console.error('Formulaire non trouvé');
            return;
        }

        console.log('Initialisation du formulaire de mémorial');
        
        // Initialiser les gestionnaires d'événements
        this.initFormEvents();
        this.initButtonEvents();
        this.initValidation();
        
        // Charger un brouillon s'il existe
        this.loadDraft();
    }

    // Initialiser les événements du formulaire
    initFormEvents() {
        // Écouter les changements dans tous les champs
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                console.log(`Champ modifié: ${input.name} = ${input.value}`);
                this.collectFormData();
            });
        });

        // Compteur de caractères pour la biographie
        const bioTextarea = document.getElementById('biographie');
        const bioCount = document.getElementById('bio-count');
        
        if (bioTextarea && bioCount) {
            bioTextarea.addEventListener('input', () => {
                const count = bioTextarea.value.length;
                bioCount.textContent = count;
                
                // Changer la couleur si on approche de la limite
                if (count > 1800) {
                    bioCount.style.color = '#ff4444';
                } else if (count > 1500) {
                    bioCount.style.color = '#ff8800';
                } else {
                    bioCount.style.color = '#666';
                }
            });
        }
    }

    // Initialiser les événements des boutons
    initButtonEvents() {
        // Bouton Retour
        const btnRetour = document.getElementById('btn-retour');
        if (btnRetour) {
            btnRetour.addEventListener('click', () => {
                this.handleRetour();
            });
        }

        // Bouton Sauvegarder brouillon
        const btnSauvegarder = document.getElementById('btn-sauvegarder');
        if (btnSauvegarder) {
            btnSauvegarder.addEventListener('click', () => {
                this.handleSauvegarder();
            });
        }

        // Bouton Aperçu
        const btnApercu = document.getElementById('btn-apercu');
        if (btnApercu) {
            btnApercu.addEventListener('click', () => {
                this.handleApercu();
            });
        }

        // Bouton Publier
        const btnPublier = document.getElementById('btn-publier');
        if (btnPublier) {
            btnPublier.addEventListener('click', () => {
                this.handlePublier();
            });
        }
    }

    // Collecter toutes les données du formulaire
    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};

        // Récupérer tous les champs simples
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Récupérer les checkboxes
        const checkboxes = this.form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            data[checkbox.name] = checkbox.checked;
        });

        this.currentData = data;
        console.log('Données collectées:', data);
        return data;
    }

    // Validation simple du formulaire
    initValidation() {
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
        });
    }

    // Valider un champ individuel
    validateField(field) {
        const value = field.value.trim();
        
        // Retirer les anciennes classes d'erreur
        field.classList.remove('error', 'valid');
        
        if (field.hasAttribute('required') && !value) {
            field.classList.add('error');
            return false;
        } else if (value) {
            field.classList.add('valid');
        }
        
        return true;
    }

    // Valider tout le formulaire
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        this.isFormValid = isValid;
        return isValid;
    }

    // Gestionnaire: Retour
    handleRetour() {
        if (confirm('Voulez-vous vraiment quitter ? Les modifications non sauvegardées seront perdues.')) {
            window.location.href = 'index.html';
        }
    }

    // Gestionnaire: Sauvegarder brouillon
    handleSauvegarder() {
        console.log('Sauvegarde du brouillon...');
        
        // Collecter les données
        const data = this.collectFormData();
        data.statut = 'brouillon';
        
        try {
            // Sauvegarder dans le localStorage
            const memorialId = memorialStorage.saveMemorial(data);
            
            // Afficher un message de succès
            this.showMessage('Brouillon sauvegardé avec succès !', 'success');
            
            // Sauvegarder l'ID dans le formulaire pour les prochaines sauvegardes
            const hiddenId = this.form.querySelector('input[name="memorial_id"]');
            if (hiddenId) {
                hiddenId.value = memorialId;
            }
            
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            this.showMessage('Erreur lors de la sauvegarde', 'error');
        }
    }

    // Gestionnaire: Aperçu
    handleApercu() {
        console.log('Aperçu du mémorial...');
        
        // Collecter les données
        const data = this.collectFormData();
        
        // Pour l'instant, on affiche les données dans la console
        console.log('Données pour l\'aperçu:', data);
        
        // TODO: Ouvrir une fenêtre d'aperçu
        alert('Fonctionnalité d\'aperçu à implémenter');
    }

    // Gestionnaire: Publier
    handlePublier() {
        console.log('Publication du mémorial...');
        
        // Valider le formulaire
        if (!this.validateForm()) {
            this.showMessage('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }
        
        // Collecter les données
        const data = this.collectFormData();
        data.statut = 'publie';
        
        try {
            // Sauvegarder dans le localStorage
            const memorialId = memorialStorage.saveMemorial(data);
            
            // Afficher un message de succès
            this.showMessage('Mémorial publié avec succès !', 'success');
            
            // Rediriger vers la page de confirmation après 2 secondes
            setTimeout(() => {
                window.location.href = 'memorial-confirmation.html';
            }, 2000);
            
        } catch (error) {
            console.error('Erreur lors de la publication:', error);
            this.showMessage('Erreur lors de la publication', 'error');
        }
    }

    // Charger un brouillon existant
    loadDraft() {
        // Cette fonctionnalité sera implémentée plus tard
        console.log('Chargement des brouillons...');
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
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
    }
    
    .form-group input.valid,
    .form-group select.valid,
    .form-group textarea.valid {
        border-color: #28a745;
        box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
    }
`;
document.head.appendChild(style);
