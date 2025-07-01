// Attendre que le DOM soit complètement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', function() {
    
    // Récupération des éléments du DOM selon VOTRE structure HTML
    const photoInput = document.getElementById('memorial-photo'); // Input file caché
    const photoPreview = document.getElementById('photo-preview'); // L'IMAGE de prévisualisation
    const choosePhotoBtn = document.getElementById('choose-main-photo'); // Bouton "Choisir une photo"
    const editPhotoBtn = document.getElementById('edit-main-photo'); // Bouton "Modifier"
    const removePhotoBtn = document.getElementById('remove-main-photo'); // Bouton "Supprimer"
    const photoOverlay = document.querySelector('.photo-overlay'); // Overlay avec texte/icône
    const photoUploadArea = document.querySelector('.photo-upload-area'); // Zone de drag & drop
    
    // URL de l'image par défaut (celle affichée initialement)
    const defaultImageSrc = 'assets/images/default-memorial.png';
    
    // Variable pour stocker si une photo personnalisée a été uploadée
    let hasCustomPhoto = false;

    // === GESTION DU CLIC SUR LE BOUTON "CHOISIR UNE PHOTO" ===
    choosePhotoBtn.addEventListener('click', function() {
        // Déclencher le clic sur l'input file caché pour ouvrir l'explorateur de fichiers
        photoInput.click();
    });

    // === GESTION DU CLIC DIRECT SUR L'OVERLAY (zone de prévisualisation) ===
    photoOverlay.addEventListener('click', function() {
        // Permettre l'upload en cliquant sur l'overlay
        photoInput.click();
    });

    // === GESTION DE LA SÉLECTION D'UNE NOUVELLE PHOTO ===
    photoInput.addEventListener('change', function(event) {
        // Récupérer le fichier sélectionné (le premier dans la liste des fichiers)
        const file = event.target.files[0];
        
        // Vérifier qu'un fichier a bien été sélectionné
        if (file) {
            // Vérifier que le fichier est bien une image
            if (file.type.startsWith('image/')) {
                // Vérifier la taille du fichier (maximum 5MB = 5 * 1024 * 1024 bytes)
                const maxSize = 5 * 1024 * 1024; // 5MB en bytes
                
                if (file.size > maxSize) {
                    // Afficher une alerte si le fichier est trop volumineux
                    alert('Le fichier est trop volumineux. Veuillez choisir une image de moins de 5MB.');
                    // Réinitialiser l'input file
                    photoInput.value = '';
                    return; // Arrêter l'exécution de la fonction
                }
                
                // Créer un objet FileReader pour lire le contenu du fichier
                const reader = new FileReader();
                
                // Définir ce qui se passe quand le fichier est lu avec succès
                reader.onload = function(e) {
                    // e.target.result contient l'URL data de l'image
                    displayPhoto(e.target.result, file.name);
                };
                
                // Définir ce qui se passe en cas d'erreur de lecture
                reader.onerror = function() {
                    alert('Erreur lors de la lecture du fichier. Veuillez réessayer.');
                    // Réinitialiser l'input file
                    photoInput.value = '';
                };
                
                // Commencer la lecture du fichier en tant qu'URL data
                reader.readAsDataURL(file);
                
            } else {
                // Afficher une alerte si le fichier n'est pas une image
                alert('Veuillez sélectionner un fichier image valide (JPG, PNG, GIF).');
                // Réinitialiser l'input file
                photoInput.value = '';
            }
        }
    });

    // === FONCTION POUR AFFICHER LA PHOTO SÉLECTIONNÉE ===
    function displayPhoto(imageSrc, fileName) {
        // Changer la source de l'IMAGE de prévisualisation
        photoPreview.src = imageSrc;
        
        // Modifier le texte alternatif de l'image avec le nom du fichier
        photoPreview.alt = 'Photo sélectionnée: ' + fileName;
        
        // Cacher l'overlay (texte "Cliquez pour ajouter une photo")
        photoOverlay.style.display = 'none';
        
        // Afficher les boutons "Modifier" et "Supprimer"
        editPhotoBtn.style.display = 'inline-block';
        removePhotoBtn.style.display = 'inline-block';
        
        // Cacher le bouton "Choisir une photo" puisqu'une photo est maintenant sélectionnée
        choosePhotoBtn.style.display = 'none';
        
        // Marquer qu'une photo personnalisée a été uploadée
        hasCustomPhoto = true;
        
        // Ajouter une classe CSS pour indiquer qu'une photo est chargée (pour le styling)
        photoPreview.classList.add('photo-loaded');
        
        // Optionnel : ajouter une bordure verte à la zone de upload pour indiquer le succès
        photoUploadArea.classList.add('photo-uploaded');
    }

    // === GESTION DU BOUTON "MODIFIER" ===
    editPhotoBtn.addEventListener('click', function() {
        // Déclencher le sélecteur de fichier pour choisir une nouvelle photo
        photoInput.click();
    });

    // === GESTION DU BOUTON "SUPPRIMER" ===
    removePhotoBtn.addEventListener('click', function() {
        // Demander confirmation avant de supprimer
        if (confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
            // Appeler la fonction pour réinitialiser l'état par défaut
            resetToDefault();
        }
    });

    // === FONCTION POUR RÉINITIALISER À L'ÉTAT PAR DÉFAUT ===
    function resetToDefault() {
        // Remettre l'image par défaut
        photoPreview.src = defaultImageSrc;
        
        // Remettre le texte alternatif par défaut
        photoPreview.alt = 'Aperçu de la photo';
        
        // Réafficher l'overlay
        photoOverlay.style.display = 'flex';
        
        // Cacher les boutons "Modifier" et "Supprimer"
        editPhotoBtn.style.display = 'none';
        removePhotoBtn.style.display = 'none';
        
        // Réafficher le bouton "Choisir une photo"
        choosePhotoBtn.style.display = 'inline-block';
        
        // Réinitialiser l'input file (vider la sélection)
        photoInput.value = '';
        
        // Marquer qu'aucune photo personnalisée n'est uploadée
        hasCustomPhoto = false;
        
        // Retirer les classes CSS pour le styling
        photoPreview.classList.remove('photo-loaded');
        photoUploadArea.classList.remove('photo-uploaded');
    }

    // === GESTION DU GLISSER-DÉPOSER (DRAG & DROP) ===
    
    // Empêcher le comportement par défaut du navigateur pour le drag & drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        photoUploadArea.addEventListener(eventName, preventDefaults, false);
        // Empêcher aussi sur le document pour éviter que le navigateur ouvre l'image
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Fonction pour empêcher le comportement par défaut
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Ajouter une classe visuelle quand on survole avec un fichier
    ['dragenter', 'dragover'].forEach(eventName => {
        photoUploadArea.addEventListener(eventName, highlight, false);
    });
    
    // Retirer la classe visuelle quand on quitte la zone
    ['dragleave', 'drop'].forEach(eventName => {
        photoUploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    // Fonction pour ajouter la classe de surbrillance
    function highlight() {
        photoUploadArea.classList.add('drag-over');
    }
    
    // Fonction pour retirer la classe de surbrillance
    function unhighlight() {
        photoUploadArea.classList.remove('drag-over');
    }
    
    // Gérer le drop (quand on lâche le fichier)
    photoUploadArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        // Récupérer les fichiers droppés
        const dt = e.dataTransfer;
        const files = dt.files;
        
        // Traiter seulement le premier fichier
        if (files.length > 0) {
            const file = files[0];
            
            // Vérifier que c'est une image
            if (file.type.startsWith('image/')) {
                // Vérifier la taille
                const maxSize = 5 * 1024 * 1024; // 5MB
                
                if (file.size > maxSize) {
                    alert('Le fichier est trop volumineux. Veuillez choisir une image de moins de 5MB.');
                    return;
                }
                
                // Simuler la sélection dans l'input file
                // Créer un nouvel objet DataTransfer pour définir les fichiers de l'input
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                photoInput.files = dataTransfer.files;
                
                // Lire et afficher le fichier
                const reader = new FileReader();
                reader.onload = function(e) {
                    displayPhoto(e.target.result, file.name);
                };
                reader.readAsDataURL(file);
                
            } else {
                alert('Veuillez déposer un fichier image valide (JPG, PNG, GIF).');
            }
        }
    }
});
