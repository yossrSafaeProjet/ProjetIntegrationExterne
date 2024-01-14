/* document.addEventListener('DOMContentLoaded', async function () {
    // Fonction pour récupérer les données utilisateur
    async function getDataPerso() {
        const urlParams = new URLSearchParams(window.location.search);
        const userDataJSON = urlParams.get('userData');
        console.log("userDataJSON", userDataJSON);
        if (userDataJSON) {
            // Convertir la chaîne JSON en objet JavaScript
            const userData = JSON.parse(decodeURIComponent(userDataJSON));
            console.log("userData", userData);
            // Remplir le formulaire avec les données récupérées
            document.getElementById('nom').value = userData[0].nom;
            document.getElementById('prenom').value = userData[0].prenom;
            document.getElementById('email').value = userData[0].email;
            document.getElementById('password').value = userData[0].password;
            document.getElementById('confirmationMotDePasse').value = userData[0].confirmationMotDePasse;
            // Remplir d'autres champs du formulaire si nécessaire
            return userData;
        } else {
            // Aucune donnée utilisateur n'a été fournie dans l'URL
            console.log("Aucune donnée utilisateur n'a été fournie dans l'URL.");

            // Retourner null ou un autre indicateur pour indiquer l'absence de données
            return null;
        }
    }

    // Récupérer les données utilisateur dès que la page est chargée
    let userData = await getDataPerso();

    // Fonction pour enregistrer ou modifier les données
    async function EnregistrerData() {
     if (!userData) {
            try {
                // Effectuer la requête vers le serveur pour enregistrer le nouvel utilisateur
                const response = await fetch('http://localhost:3000/enregistrerUtilisateur/enregistrer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nom: document.getElementById('nom').value,
                        prenom: document.getElementById('prenom').value,
                        email: document.getElementById('email').value,
                        password: document.getElementById('password').value,
                        confirmationMotDePasse: document.getElementById('confirmationMotDePasse').value
                    })
                });

                if (response.status === 200) {
                    console.log("enregistré avec succès ")
                    // Rediriger vers la page de connexion après l'enregistrement
                    window.location.href = '/connexion';
                }
            } catch (error) {
                console.error(error.message);
                // Gérer l'erreur, par exemple, renvoyer un message d'erreur au client
                res.status(400).json({ error: error.message });
            }
        } else  if (userData) {
            // Mode modification
            console.log("entré ici");
            
            try {
                // Effectuer la requête vers le serveur pour mettre à jour l'utilisateur existant
                const responseData = await fetch(`http://localhost:3000/patch/${userData[0].id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: userData[0].id,
                        nom: userData[0].nom,
                        prenom: userData[0].prenom,
                        email: userData[0].email,
                    })
                });
            
                if (responseData.status === 200) {
                    // Rediriger vers la page de l'espace après la modification
                    userData[0].nom=document.getElementById('nom').value;
                console.log("le nom modifié" ,userData[0].nom);
                    userData[0].prenom=document.getElementById('prenom').value;
                    userData[0].email=document.getElementById('prenom').value;
                    window.location.href = '/espace';
                }
            } catch (error) {
                console.error(error.message);
                // Gérer l'erreur, par exemple, renvoyer un message d'erreur au client
            }
        }
    }

    // Appeler la fonction d'enregistrement/modification lors du clic sur le bouton
     document.getElementById('submitButton').addEventListener('click', EnregistrerData);
 });
 */