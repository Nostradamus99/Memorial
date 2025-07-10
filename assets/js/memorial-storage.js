// memorial-storage.js
// Gestion du stockage local des mémoriaux

// Classe pour gérer le stockage des mémoriaux
class MemorialStorage {
    constructor() {
        this.storageKey = 'memorial_locaux';
    }

    // Récupérer tous les mémoriaux sauvegardés
    getAllMemorials() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    // Sauvegarder un nouveau mémorial
    saveMemorial(memorialData) {
        const memorials = this.getAllMemorials();
        
        // Générer un ID unique si ce n'est pas déjà fait
        if (!memorialData.id) {
            memorialData.id = this.generateId();
        }
        
        // Ajouter la date de création
        memorialData.date_creation = new Date().toISOString();
        memorialData.statut = 'brouillon'; // ou 'publie'
        
        // Ajouter le mémorial à la liste
        memorials.push(memorialData);
        
        // Sauvegarder dans le localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(memorials));
        
        console.log('Mémorial sauvegardé avec succès:', memorialData.id);
        return memorialData.id;
    }

    // Générer un ID unique simple
    generateId() {
        return 'memorial_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Récupérer un mémorial par son ID
    getMemorialById(id) {
        const memorials = this.getAllMemorials();
        return memorials.find(memorial => memorial.id === id);
    }

    // Supprimer un mémorial
    deleteMemorial(id) {
        const memorials = this.getAllMemorials();
        const filteredMemorials = memorials.filter(memorial => memorial.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredMemorials));
        console.log('Mémorial supprimé:', id);
    }

    // Vérifier si le stockage local est disponible
    isStorageAvailable() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
}

// Créer une instance globale
const memorialStorage = new MemorialStorage();

