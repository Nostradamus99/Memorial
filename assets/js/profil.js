// Gestion de l'affichage du profil utilisateur
document.addEventListener('DOMContentLoaded', function() {
    
    // 📂 Charger et afficher les données au démarrage
    loadUserProfile();
    
    // 🔄 Fonction pour charger et afficher le profil
    function loadUserProfile() {
        console.log('📂 Chargement du profil utilisateur...');
        
        // Récupérer les données de connexion (nom et email)
        const userAuth = localStorage.getItem('utilisateur');
        
        // Récupérer les données du profil complet
        const userProfile = localStorage.getItem('userProfile');
        
        let authData = null;
        let profileData = null;
        
        // 🔍 Parser les données d'authentification
        if (userAuth) {
            try {
                authData = JSON.parse(userAuth);
                console.log('✅ Données d\'authentification:', authData);
            } catch (e) {
                console.error('❌ Erreur parsing données auth:', e);
            }
        }
        
        // 🔍 Parser les données du profil
        if (userProfile) {
            try {
                profileData = JSON.parse(userProfile);
                console.log('✅ Données du profil:', profileData);
            } catch (e) {
                console.error('❌ Erreur parsing données profil:', e);
            }
        }
        
        // 📝 Remplir les champs d'affichage
        updateDisplayField('nom-profil', getDisplayValue(
            profileData?.fullName || authData?.nom,
            'Votre nom complet'
        ));
        
        updateDisplayField('email-profil', getDisplayValue(
            profileData?.email || authData?.email,
            'Votre adresse email'
        ));
        
        updateDisplayField('telephone-profil', getDisplayValue(
            profileData?.phone,
            'Votre numéro de téléphone'
        ));
        
        updateDisplayField('date_naissance-profil', getDisplayValue(
            profileData?.birthDate ? formatDate(profileData.birthDate) : null,
            'Votre date de naissance'
        ));
        
        updateDisplayField('adresse-profil', getDisplayValue(
            profileData?.address,
            'Votre adresse'
        ));
        
        console.log('✅ Profil affiché avec succès');
    }
    
    // 🔄 Fonction pour mettre à jour un champ d'affichage
    function updateDisplayField(fieldId, value) {
        const element = document.getElementById(fieldId);
        if (element) {
            element.textContent = value;
            
            // Ajouter une classe pour différencier les données réelles des placeholders
            if (value.startsWith('Votre ')) {
                element.classList.add('placeholder-text');
            } else {
                element.classList.remove('placeholder-text');
            }
        }
    }
    
    // 📝 Fonction pour obtenir la valeur d'affichage
    function getDisplayValue(value, placeholder) {
        return value && value.trim() !== '' ? value : placeholder;
    }
    
    // 📅 Fonction pour formater la date
    function formatDate(dateString) {
        if (!dateString) return null;
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (e) {
            console.error('❌ Erreur formatage date:', e);
            return dateString;
        }
    }
    
    // 🔄 Fonction publique pour recharger le profil (utile après modifications)
    window.reloadUserProfile = function() {
        loadUserProfile();
    };
    
    // 🔍 Fonction de débogage pour voir les données
    window.debugProfile = function() {
        console.log('🔍 Données localStorage:');
        console.log('- utilisateur:', localStorage.getItem('utilisateur'));
        console.log('- userProfile:', localStorage.getItem('userProfile'));
    };
});

// Gestion de la modification du profil utilisateur
document.addEventListener('DOMContentLoaded', function() {
    const editToggle = document.querySelector('.edit-toggle');
    const personalDisplay = document.getElementById('personal-display');
    const personalForm = document.getElementById('personal-form');
    const cancelEdit = document.querySelector('.cancel-edit');
    const saveBtn = document.querySelector('button[type="submit"]');
    
    // Bouton "Modifier"
    if (editToggle) {
        editToggle.addEventListener('click', function() {
            console.log('📝 Ouverture du formulaire de modification...');
            
            // 📂 Charger les données existantes dans le formulaire
            loadDataIntoForm();
            
            // Afficher le formulaire
            personalDisplay.style.display = 'none';
            personalForm.hidden = false;
        });
    }
    
    // Bouton "Annuler"
    if (cancelEdit) {
        cancelEdit.addEventListener('click', function() {
            console.log('❌ Annulation des modifications');
            
            // Retour à l'affichage sans sauvegarder
            personalDisplay.style.display = 'block';
            personalForm.hidden = true;
            
            // Optionnel : vider le formulaire
            personalForm.reset();
        });
    }
    
    // Bouton "Sauvegarder"
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('💾 Sauvegarde du profil...');
            
            // Récupérer les nouvelles valeurs
            const prenom = document.getElementById('prenom').value.trim();
            const nom = document.getElementById('nom').value.trim();
            const email = document.getElementById('email').value.trim();
            const telephone = document.getElementById('telephone').value.trim();
            const dateNaissance = document.getElementById('date_naissance').value;
            const adresse = document.getElementById('adresse').value.trim();
            
            // 🔍 Validation basique
            if (!prenom || !nom || !email) {
                alert('❌ Veuillez remplir au moins le prénom, nom et email');
                return;
            }
            
            // 📦 Créer l'objet profil complet
            const profileData = {
                fullName: `${prenom} ${nom}`,
                firstName: prenom,
                lastName: nom,
                email: email,
                phone: telephone,
                birthDate: dateNaissance,
                address: adresse,
                lastModified: new Date().toISOString()
            };
            
            // 💾 Sauvegarder dans localStorage
            localStorage.setItem('userProfile', JSON.stringify(profileData));
            console.log('✅ Profil sauvegardé:', profileData);
            
            // 🔄 Mettre à jour aussi les données d'authentification si nécessaire
            updateAuthData(email, `${prenom} ${nom}`);
            
            // 📝 Mettre à jour l'affichage immédiatement
            updateDisplayFromData(profileData);
            
            // Retour à l'affichage normal
            personalDisplay.style.display = 'block';
            personalForm.hidden = true;
            
            alert('✅ Profil mis à jour avec succès !');
        });
    }
    
    // 📂 Fonction pour charger les données dans le formulaire
    function loadDataIntoForm() {
        console.log('📂 Chargement des données dans le formulaire...');
        
        // Récupérer les données existantes
        const userProfile = localStorage.getItem('userProfile');
        const userAuth = localStorage.getItem('utilisateur');
        
        let profileData = null;
        let authData = null;
        
        // Parser les données
        if (userProfile) {
            try {
                profileData = JSON.parse(userProfile);
            } catch (e) {
                console.error('❌ Erreur parsing userProfile:', e);
            }
        }
        
        if (userAuth) {
            try {
                authData = JSON.parse(userAuth);
            } catch (e) {
                console.error('❌ Erreur parsing userAuth:', e);
            }
        }
        
        // Remplir le formulaire avec les données existantes
        if (profileData) {
            // Séparer le nom complet si nécessaire
            const nameParts = profileData.fullName ? profileData.fullName.split(' ') : [];
            const firstName = profileData.firstName || nameParts[0] || '';
            const lastName = profileData.lastName || nameParts.slice(1).join(' ') || '';
            
            setFormField('prenom', firstName);
            setFormField('nom', lastName);
            setFormField('email', profileData.email);
            setFormField('telephone', profileData.phone);
            setFormField('date_naissance', profileData.birthDate);
            setFormField('adresse', profileData.address);
        } else if (authData) {
            // Fallback sur les données d'authentification
            setFormField('prenom', authData.nom || '');
            setFormField('email', authData.email || '');
        }
        
        console.log('✅ Formulaire pré-rempli');
    }
    
    // 📝 Fonction helper pour remplir un champ
    function setFormField(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (field && value) {
            field.value = value;
        }
    }
    
    // 🔄 Fonction pour mettre à jour les données d'authentification
    function updateAuthData(email, fullName) {
        const userAuth = localStorage.getItem('utilisateur');
        if (userAuth) {
            try {
                const authData = JSON.parse(userAuth);
                authData.email = email;
                authData.nom = fullName;
                localStorage.setItem('utilisateur', JSON.stringify(authData));
                console.log('✅ Données d\'authentification mises à jour');
            } catch (e) {
                console.error('❌ Erreur mise à jour auth:', e);
            }
        }
    }
    
    // 📝 Fonction pour mettre à jour l'affichage immédiatement
    function updateDisplayFromData(profileData) {
        // Formater la date si elle existe
        let formattedDate = profileData.birthDate;
        if (formattedDate) {
            try {
                const date = new Date(formattedDate);
                formattedDate = date.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            } catch (e) {
                console.error('❌ Erreur formatage date:', e);
            }
        }
        
        // Mettre à jour l'affichage
        document.getElementById('nom-profil').textContent = profileData.fullName || 'Votre nom complet';
        document.getElementById('email-profil').textContent = profileData.email || 'Votre adresse email';
        document.getElementById('telephone-profil').textContent = profileData.phone || 'Votre numéro de téléphone';
        document.getElementById('date_naissance-profil').textContent = formattedDate || 'Votre date de naissance';
        document.getElementById('adresse-profil').textContent = profileData.address || 'Votre adresse';
        
        // Gérer les classes CSS pour les placeholders
        updateFieldStyle('nom-profil', profileData.fullName);
        updateFieldStyle('email-profil', profileData.email);
        updateFieldStyle('telephone-profil', profileData.phone);
        updateFieldStyle('date_naissance-profil', formattedDate);
        updateFieldStyle('adresse-profil', profileData.address);
    }
    
    // 🎨 Fonction pour mettre à jour le style des champs
    function updateFieldStyle(fieldId, value) {
        const element = document.getElementById(fieldId);
        if (element) {
            if (value && value.trim() !== '' && !value.startsWith('Votre ')) {
                element.classList.remove('placeholder-text');
            } else {
                element.classList.add('placeholder-text');
            }
        }
    }
});

// Changer le mot de passe
document.addEventListener('DOMContentLoaded', function() {
    const passwordBtn = document.querySelector('[data-toggle="password-form"]');
    const passwordForm = document.getElementById('password-form');
    const cancelPasswordBtn = document.querySelector('.cancel-password');
    const securityInfo = document.querySelector('.security-info');
    
    // 📂 Charger les données stockées au démarrage
    loadPasswordData();
    
    // Bouton "Changer"
    if (passwordBtn) {
        passwordBtn.addEventListener('click', function() {
            securityInfo.style.display = 'none';
            passwordForm.hidden = false;
        });
    }
    
    // Bouton "Annuler"
    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', function() {
            securityInfo.style.display = 'block';
            passwordForm.hidden = true;
            passwordForm.reset();
        });
    }
    
    // Soumission du formulaire
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('🔄 Formulaire soumis !');
            
            const currentPassword = document.getElementById('current_password').value;
            const newPassword = document.getElementById('new_password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            
            console.log('📝 Valeurs récupérées:', { currentPassword, newPassword, confirmPassword });
            
            // ✅ Vérifications
            if (newPassword !== confirmPassword) {
                alert('❌ Les nouveaux mots de passe ne correspondent pas !');
                return;
            }
            
            if (newPassword.length < 8) {
                alert('❌ Le mot de passe doit contenir au moins 8 caractères !');
                return;
            }
            
            // 💾 Récupérer et parser les données utilisateur
            const storedUserData = localStorage.getItem('utilisateur');
            console.log('🔍 Données brutes:', storedUserData);
            
            let storedPassword = null;
            let userData = null;
            
            if (storedUserData) {
                try {
                    userData = JSON.parse(storedUserData);
                    storedPassword = userData.motDePasse;
                    console.log('🔍 Mot de passe extrait:', storedPassword);
                } catch (e) {
                    console.error('❌ Erreur parsing JSON:', e);
                }
            }
            
            console.log('🔍 Mot de passe stocké:', storedPassword);
            console.log('🔍 Mot de passe saisi:', currentPassword);
            
            // 🎯 LOGIQUE SIMPLIFIÉE
            if (!storedPassword) {
                // Aucun mot de passe stocké = premier changement
                console.log('✅ Premier changement de mot de passe');
                
                // Créer ou mettre à jour l'objet utilisateur
                const newUserData = userData || {};
                newUserData.motDePasse = newPassword;
                
                localStorage.setItem('utilisateur', JSON.stringify(newUserData));
                
                // 📅 Sauvegarder la date
                const today = new Date();
                localStorage.setItem('passwordLastModified', today.toISOString());
                
                // ✅ Succès
                alert('✅ Mot de passe défini avec succès !');
                
                // Retour à l'affichage
                updatePasswordDisplay();
                securityInfo.style.display = 'block';
                passwordForm.hidden = true;
                passwordForm.reset();
                
            } else {
                // Vérifier l'ancien mot de passe
                if (currentPassword === storedPassword) {
                    console.log('✅ Ancien mot de passe correct');
                    
                    // Mettre à jour le mot de passe dans l'objet
                    userData.motDePasse = newPassword;
                    localStorage.setItem('utilisateur', JSON.stringify(userData));
                    
                    // 📅 Sauvegarder la date
                    const today = new Date();
                    localStorage.setItem('passwordLastModified', today.toISOString());
                    
                    // ✅ Succès
                    alert('✅ Mot de passe changé avec succès !');
                    
                    // Retour à l'affichage
                    updatePasswordDisplay();
                    securityInfo.style.display = 'block';
                    passwordForm.hidden = true;
                    passwordForm.reset();
                    
                } else {
                    console.log('❌ Ancien mot de passe incorrect');
                    alert('❌ Mot de passe actuel incorrect !');
                }
            }
        });
    }
    
    // 📂 Fonction pour charger les données
    function loadPasswordData() {
        const lastModified = localStorage.getItem('passwordLastModified');
        if (lastModified) {
            updatePasswordDisplay();
        }
    }
    
    // 🔄 Fonction pour mettre à jour l'affichage de la date
    function updatePasswordDisplay() {
        const timeElement = document.getElementById('password-last-modified');
        const lastModified = localStorage.getItem('passwordLastModified');
        
        if (timeElement && lastModified) {
            const date = new Date(lastModified);
            const formattedDate = date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            timeElement.textContent = formattedDate;
            timeElement.setAttribute('datetime', date.toISOString().split('T')[0]);
            
            console.log('✅ Date mise à jour:', formattedDate);
        }
    }
});

// 🚪 Gestion de la déconnexion
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('btn-deconnexion');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            console.log('🚪 Déconnexion en cours...');
            
            const confirmLogout = confirm(
                "🚪 Déconnexion\n\n" +
                "Voulez-vous vraiment vous déconnecter ?\n\n" +
                "Vos données seront conservées pour votre prochaine connexion."
            );
            
            if (confirmLogout) {
                // Animation de déconnexion (optionnel)
                document.body.style.opacity = '0.8';
                document.body.style.transition = 'opacity 0.3s';
                
                // Message de confirmation
                console.log('✅ Déconnexion réussie - Redirection...');
                
                // 🔄 Redirection verso la page d'accueil après 1 seconde
                setTimeout(() => {
                    window.location.href = '/';  // Ajustez selon votre structure
                }, 1000);
                
            } else {
                console.log('❌ Déconnexion annulée');
            }
        });
    }
});

// Gestion de la suppression du compte utilisateur
document.addEventListener('DOMContentLoaded', function() {
    const deleteAccountBtn = document.querySelector('button[data-confirm="delete-account"]');
    
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            console.log('⚠️ Tentative de suppression du compte...');
            
            // 🛡️ Double confirmation de sécurité
            showDeleteConfirmation();
        });
    }
    
    // 🚨 Fonction de confirmation de suppression
    function showDeleteConfirmation() {
        const confirmDelete = confirm(
            "⚠️ ATTENTION - SUPPRESSION DÉFINITIVE ⚠️\n\n" +
            "Êtes-vous sûr de vouloir supprimer votre compte ?\n\n" +
            "Cette action :\n" +
            "• Supprimera TOUS vos mémoriaux\n" +
            "• Effacera TOUTES vos données personnelles\n" +
            "• Est IRRÉVERSIBLE\n\n" +
            "Cliquez sur OK pour SUPPRIMER ou Annuler pour CONSERVER"
        );
        
        if (confirmDelete) {
            deleteUserAccount();
        } else {
            console.log('✅ Suppression annulée par l\'utilisateur');
        }
    }
    
    // 🗑️ Fonction de suppression effective
    function deleteUserAccount() {
        console.log('🔥 Suppression du compte en cours...');
        
        try {
            // 📋 Lister toutes les données à supprimer
            const keysToDelete = [
                'utilisateur',           // Données d'authentification
                'userProfile',          // Données du profil
                'userMemorials',        // Mémoriaux (si existant)
                'userSettings',         // Paramètres (si existant)
                'userHistory',          // Historique (si existant)
                'userFavorites',        // Favoris (si existant)
                'userNotifications'     // Notifications (si existant)
            ];
            
            // 📂 Vérifier les données présentes avant suppression
            console.log('📋 Données présentes avant suppression:');
            keysToDelete.forEach(key => {
                const data = localStorage.getItem(key);
                if (data) {
                    console.log(`- ${key}:`, data.substring(0, 50) + '...');
                }
            });
            
            // 🗑️ Supprimer toutes les données utilisateur
            let deletedCount = 0;
            keysToDelete.forEach(key => {
                if (localStorage.getItem(key)) {
                    localStorage.removeItem(key);
                    deletedCount++;
                    console.log(`✅ Supprimé: ${key}`);
                }
            });
            
            // 🧹 Nettoyage supplémentaire - supprimer toutes les clés commençant par 'user'
            const allKeys = Object.keys(localStorage);
            allKeys.forEach(key => {
                if (key.toLowerCase().startsWith('user') || key.toLowerCase().startsWith('memorial')) {
                    localStorage.removeItem(key);
                    console.log(`🧹 Nettoyage supplémentaire: ${key}`);
                }
            });
            
            console.log(`🗑️ ${deletedCount} éléments supprimés du localStorage`);
            
            // ✅ Confirmation de suppression
            showDeletionSuccess();
            
        } catch (error) {
            console.error('❌ Erreur lors de la suppression:', error);
            alert('❌ Erreur lors de la suppression du compte. Veuillez réessayer.');
        }
    }
    
    // 🎉 Fonction de succès avec redirection
    function showDeletionSuccess() {
        // Message de confirmation
        alert('✅ Compte supprimé avec succès !\n\nVous allez être redirigé vers la page d\'accueil.');
        
        // Animation de suppression (optionnel)
        document.body.style.opacity = '0.5';
        document.body.style.transition = 'opacity 0.5s';
        
        // 🔄 Redirection vers la page d'accueil après 2 secondes
        setTimeout(() => {
            console.log('🏠 Redirection vers la page d\'accueil...');
            
            // Plusieurs options de redirection (choisissez celle qui convient)
            window.location.href = '/';              // Racine du site
            // window.location.href = '/index.html';   // Page d'accueil spécifique
            // window.location.href = '../index.html'; // Si dans un sous-dossier
            
        }, 2000);
    }
    
    // 🔍 Fonction de débogage pour vérifier les données
    window.debugUserData = function() {
        console.log('🔍 Données utilisateur actuelles:');
        console.log('- utilisateur:', localStorage.getItem('utilisateur'));
        console.log('- userProfile:', localStorage.getItem('userProfile'));
        console.log('- Toutes les clés:', Object.keys(localStorage));
    };
});

